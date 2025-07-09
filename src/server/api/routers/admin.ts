import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env";

// 管理者権限チェック用ミドルウェア
const adminMiddleware = protectedProcedure.use(async ({ ctx, next }) => {
  // 管理者メールアドレスが設定されていない場合はアクセス拒否
  if (!env.ADMIN_EMAILS) {
    throw new TRPCError({ 
      code: "FORBIDDEN", 
      message: "管理者権限設定が見つかりません" 
    });
  }
  
  const adminEmails = env.ADMIN_EMAILS.split(",").map(email => email.trim());
  const userEmail = ctx.session.user.email;
  
  // デバッグ用ログ（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log("Admin check:", { userEmail, adminEmails, isAdmin: adminEmails.includes(userEmail ?? "") });
  }
  
  if (!userEmail || !adminEmails.includes(userEmail)) {
    throw new TRPCError({ 
      code: "FORBIDDEN", 
      message: `管理者権限が必要です (current: ${userEmail})` 
    });
  }
  
  return next();
});

export const adminRouter = createTRPCRouter({
  // 全ユーザー一覧を取得
  getAllUsers: adminMiddleware.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        _count: {
          select: {
            studySessions: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  }),

  // 特定ユーザーの詳細情報を取得
  getUserDetails: adminMiddleware
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          email: true,
          nickname: true,
          studySessions: {
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
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ユーザーが見つかりません",
        });
      }

      return user;
    }),

  // 管理者によるユーザー削除
  deleteUser: adminMiddleware
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = input.userId;
      
      // 自分自身の削除を防止
      if (userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "自分自身を削除することはできません",
        });
      }

      // 関連データを順次削除
      await ctx.db.studySession.deleteMany({
        where: { userId: userId },
      });
      
      await ctx.db.session.deleteMany({
        where: { userId: userId },
      });
      
      await ctx.db.account.deleteMany({
        where: { userId: userId },
      });
      
      await ctx.db.user.delete({
        where: { id: userId },
      });

      return { success: true };
    }),

  // 管理者統計情報を取得
  getStats: adminMiddleware.query(async ({ ctx }) => {
    const [userCount, sessionCount, totalDuration] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.studySession.count(),
      ctx.db.studySession.aggregate({
        _sum: {
          duration: true,
        },
      }),
    ]);

    return {
      userCount,
      sessionCount,
      totalDuration: totalDuration._sum.duration ?? 0,
    };
  }),
});