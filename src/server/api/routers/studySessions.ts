import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const studySessionsRouter = createTRPCRouter({
  // 勉強記録を作成 - ログインユーザーのみ
    create: protectedProcedure
    .input(z.object({
        subject: z.string().trim().min(1, "科目名は必須です"),
        duration: z.number().min(1, "勉強時間は1分以上である必要があります"),
        date: z.date().optional(),
        memo: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.studySession.create({
            data: {
                subject: input.subject,
                duration: input.duration,
                date: input.date ?? new Date(),
                memo: input.memo,
                userId: ctx.session.user.id, // ログインユーザーのIDを保存
            },
        });
    }),

  // ログインユーザーの勉強記録を取得
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.db.studySession.findMany({
            where: {
                userId: ctx.session.user.id, // ログインユーザーの記録のみ取得
            },
            orderBy: { date: "desc" },
        });
    }),

  // 勉強記録を削除 - ログインユーザーの記録のみ
    delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.studySession.delete({
            where: { 
                id: input.id,
                userId: ctx.session.user.id, // ログインユーザーの記録のみ削除可能
            },
        });
    }),
});