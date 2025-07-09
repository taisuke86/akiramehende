import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  // 月別統計を取得
  getMonthlyStats: protectedProcedure
    .input(z.object({
      year: z.number().optional(),
      month: z.number().min(1).max(12).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const targetYear = input.year ?? now.getFullYear();
      const targetMonth = input.month ?? (now.getMonth() + 1);
      
      // 月の開始日と終了日を計算（JST基準）
      const startDate = new Date(targetYear, targetMonth - 1, 1);
      const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

      // 月別学習記録を取得
      const sessions = await ctx.db.studySession.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          subject: true,
          duration: true,
          date: true,
          memo: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      // 統計を計算
      const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
      const totalSessions = sessions.length;
      const subjects = [...new Set(sessions.map(s => s.subject))];
      
      // 科目別統計
      const subjectStats = subjects.map(subject => {
        const subjectSessions = sessions.filter(s => s.subject === subject);
        return {
          subject,
          sessions: subjectSessions.length,
          duration: subjectSessions.reduce((sum, s) => sum + s.duration, 0),
        };
      });

      // 日別統計
      const dailyStats: Record<string, number> = {};
      sessions.forEach(session => {
        const dateKey = session.date.toISOString().split('T')[0];
        if (dateKey) {
          dailyStats[dateKey] = (dailyStats[dateKey] ?? 0) + session.duration;
        }
      });

      return {
        year: targetYear,
        month: targetMonth,
        totalDuration,
        totalSessions,
        averageDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
        subjectStats: subjectStats.sort((a, b) => b.duration - a.duration),
        dailyStats,
        recentSessions: sessions.slice(0, 5), // 最新5件
      };
    }),

  // 年間統計を取得
  getYearlyStats: protectedProcedure
    .input(z.object({
      year: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const targetYear = input.year ?? new Date().getFullYear();
      
      const startDate = new Date(targetYear, 0, 1);
      const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

      const sessions = await ctx.db.studySession.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          duration: true,
          date: true,
          subject: true,
        },
      });

      // 月別統計
      const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const monthSessions = sessions.filter(s => s.date.getMonth() + 1 === month);
        return {
          month,
          sessions: monthSessions.length,
          duration: monthSessions.reduce((sum, s) => sum + s.duration, 0),
        };
      });

      return {
        year: targetYear,
        monthlyStats,
        totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0),
        totalSessions: sessions.length,
      };
    }),

  // 学習目標の進捗を取得（IPA試験対応）
  getGoalProgress: protectedProcedure
    .query(async ({ ctx }) => {
      const now = new Date();
      
      // ユーザーの試験設定を取得
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          targetExam: true,
          examDate: true,
          weekdayStudyHours: true,
          weekendStudyHours: true,
        },
      });

      // IPA試験設定がない場合は従来の月間目標
      if (!user?.targetExam || !user?.examDate) {
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();
        const startDate = new Date(thisYear, thisMonth - 1, 1);
        const endDate = new Date(thisYear, thisMonth, 0, 23, 59, 59);

        const thisMonthSessions = await ctx.db.studySession.findMany({
          where: {
            userId: ctx.session.user.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            duration: true,
          },
        });

        const thisMonthDuration = thisMonthSessions.reduce((sum, s) => sum + s.duration, 0);

        return {
          type: 'monthly' as const,
          thisMonthDuration,
          daysInMonth: new Date(thisYear, thisMonth, 0).getDate(),
          currentDay: now.getDate(),
          hasExamSettings: false,
        };
      }

      // IPA試験設定がある場合は試験対応の進捗
      const { getExamByCode } = await import("~/lib/examMaster");
      const examInfo = getExamByCode(user.targetExam);
      
      if (!examInfo) {
        throw new Error("無効な試験コードです");
      }

      const examDate = new Date(user.examDate);
      const daysUntilExam = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // 全期間の学習記録を取得
      const allSessions = await ctx.db.studySession.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          duration: true,
          date: true,
        },
      });

      const totalStudiedMinutes = allSessions.reduce((sum, s) => sum + s.duration, 0);
      const totalStudiedHours = totalStudiedMinutes / 60;
      const targetHours = examInfo.recommendedHours;
      const progressPercentage = Math.min(Math.round((totalStudiedHours / targetHours) * 100), 100);
      const remainingHours = Math.max(targetHours - totalStudiedHours, 0);

      // 今週の学習記録
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // 日曜日を週の始まりとする
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const thisWeekSessions = allSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
      });

      const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration, 0);
      const thisWeekHours = thisWeekMinutes / 60;

      // 週間目標計算（平日5日 + 休日2日）
      const weeklyTargetHours = ((user.weekdayStudyHours ?? 0) * 5) + ((user.weekendStudyHours ?? 0) * 2);

      return {
        type: 'exam' as const,
        examInfo,
        examDate: user.examDate,
        daysUntilExam: Math.max(daysUntilExam, 0),
        isExamPassed: daysUntilExam <= 0,
        totalStudiedHours,
        targetHours,
        progressPercentage,
        remainingHours,
        thisWeekHours,
        weeklyTargetHours,
        weeklyProgressPercentage: Math.min(Math.round((thisWeekHours / weeklyTargetHours) * 100), 100),
        weekdayStudyHours: user.weekdayStudyHours,
        weekendStudyHours: user.weekendStudyHours,
        hasExamSettings: true,
      };
    }),
});