import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // 現在のユーザー情報を取得
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        nickname: true,
      },
    });
  }),

  // ニックネームを更新
  updateNickname: protectedProcedure
    .input(
      z.object({
        nickname: z
          .string()
          .min(1, "ニックネームは1文字以上で入力してください")
          .max(50, "ニックネームは50文字以内で入力してください")
          .trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { nickname: input.nickname },
      });
    }),

  // ニックネームを削除（空にする）
  clearNickname: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { nickname: null },
    });
  }),

  // アカウントを完全削除
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    
    // 関連する学習記録を削除
    await ctx.db.studySession.deleteMany({
      where: { userId: userId },
    });
    
    // アカウント・セッション関連データを削除
    await ctx.db.session.deleteMany({
      where: { userId: userId },
    });
    
    await ctx.db.account.deleteMany({
      where: { userId: userId },
    });
    
    // 最後にユーザーを削除
    await ctx.db.user.delete({
      where: { id: userId },
    });
    
    return { success: true };
  }),
});