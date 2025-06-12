import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const studySessionsRouter = createTRPCRouter({
  // 勉強記録を作成 .input()で入力値の検証を行う。
    create: publicProcedure
    .input(z.object({
        subject: z.string().trim().min(1, "科目名は必須です"),
        duration: z.number().min(1, "勉強時間は1分以上である必要があります"),
        date: z.date().optional(),
        memo: z.string().optional(),
    })) // .mutation()が実際の処理
        // そしてこのタイミングでdbへ接続し保管する。
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.studySession.create({
            data: {
                subject: input.subject,
                duration: input.duration,
                date: input.date ?? new Date(),
                memo: input.memo,
            },
        });
    }),

  // 全ての勉強記録を取得
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.studySession.findMany({
            orderBy: { date: "desc" },
        });
    }),

  // 勉強記録を削除
    delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.studySession.delete({
            where: { id: input.id },
        });
    }),
});