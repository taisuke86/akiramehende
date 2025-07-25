import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { IPA_EXAMS, getExamByCode } from "~/lib/examMaster";

export const examRouter = createTRPCRouter({
  // 全試験一覧を取得
  getAllExams: protectedProcedure.query(() => {
    return IPA_EXAMS;
  }),

  // ユーザーの試験設定を取得
  getExamSettings: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        targetExam: true,
        examDate: true,
        weekdayStudyHours: true,
        weekendStudyHours: true,
      },
    });

    if (!user?.targetExam) {
      return null;
    }

    const examInfo = getExamByCode(user.targetExam);
    if (!examInfo) {
      return null;
    }

    return {
      ...user,
      examInfo,
    };
  }),

  // 試験設定を更新
  updateExamSettings: protectedProcedure
    .input(z.object({
      targetExam: z.string(),
      examDate: z.date(),
      weekdayStudyHours: z.number().min(0).max(24),
      weekendStudyHours: z.number().min(0).max(24),
    }))
    .mutation(async ({ ctx, input }) => {
      // 試験コードが有効かチェック
      const examInfo = getExamByCode(input.targetExam);
      if (!examInfo) {
        throw new Error("無効な試験コードです");
      }

      // 試験日が過去でないかチェック
      if (input.examDate < new Date()) {
        throw new Error("試験日は未来の日付を設定してください");
      }

      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          targetExam: input.targetExam,
          examDate: input.examDate,
          weekdayStudyHours: input.weekdayStudyHours,
          weekendStudyHours: input.weekendStudyHours,
        },
      });
    }),

  // 学習計画を算出
  getStudyPlan: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        targetExam: true,
        examDate: true,
        weekdayStudyHours: true,
        weekendStudyHours: true,
      },
    });

    if (!user?.targetExam || !user?.examDate || !user?.weekdayStudyHours || !user?.weekendStudyHours) {
      return null;
    }

    const examInfo = getExamByCode(user.targetExam);
    if (!examInfo) {
      return null;
    }

    const today = new Date();
    const examDate = new Date(user.examDate);
    
    // 試験日までの日数
    const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExam <= 0) {
      return {
        examInfo,
        daysUntilExam: 0,
        isExamPassed: true,
        message: "試験日が過ぎています",
      };
    }

    // 週数と余り日数
    const weeks = Math.floor(daysUntilExam / 7);
    const remainingDays = daysUntilExam % 7;

    // 平日・休日の日数を計算（1週間 = 平日5日 + 休日2日）
    let totalWeekdays = weeks * 5;
    let totalWeekends = weeks * 2;

    // 余り日数の平日・休日を計算
    for (let i = 0; i < remainingDays; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayOfWeek = checkDate.getDay(); // 0=日曜, 6=土曜
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        totalWeekends++;
      } else {
        totalWeekdays++;
      }
    }

    // 総学習可能時間
    const totalAvailableHours = (totalWeekdays * user.weekdayStudyHours) + (totalWeekends * user.weekendStudyHours);
    
    // 週平均学習時間
    const weeklyAverageHours = weeks > 0 
      ? totalAvailableHours / weeks 
      : totalAvailableHours;

    // 既存の学習時間を取得（全期間）
    const existingSessions = await ctx.db.studySession.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        duration: true,
      },
    });

    const completedHours = existingSessions.reduce((sum, session) => sum + session.duration, 0) / 60;

    return {
      examInfo,
      daysUntilExam,
      weeks,
      remainingDays,
      totalWeekdays,
      totalWeekends,
      weekdayStudyHours: user.weekdayStudyHours,
      weekendStudyHours: user.weekendStudyHours,
      totalAvailableHours,
      weeklyAverageHours,
      completedHours,
      remainingHours: Math.max(examInfo.recommendedHours - completedHours, 0),
      progressPercentage: Math.min((completedHours / examInfo.recommendedHours) * 100, 100),
      isOnTrack: totalAvailableHours >= (examInfo.recommendedHours - completedHours),
      examDate: user.examDate,
    };
  }),

  // 試験設定をクリア
  clearExamSettings: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        targetExam: null,
        examDate: null,
        weekdayStudyHours: null,
        weekendStudyHours: null,
      },
    });
  }),
});