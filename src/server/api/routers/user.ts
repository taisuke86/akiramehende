import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // 現在のユーザー情報を取得
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,     // NextAuth.js互換性（表示には使用しない）
        email: true,
        image: true,    // NextAuth.js互換性（表示には使用しない）
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
});