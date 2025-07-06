import { postRouter } from "~/server/api/routers/post";
import { studySessionsRouter } from "~/server/api/routers/studySessions";
import { userRouter } from "~/server/api/routers/user";
import { adminRouter } from "~/server/api/routers/admin";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { examRouter } from "~/server/api/routers/exam";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter, // 既存（サンプル投稿API）
  studySessions: studySessionsRouter,  // 勉強記録API
  user: userRouter, // ユーザープロフィールAPI
  admin: adminRouter, // 管理者用API
  dashboard: dashboardRouter, // ダッシュボード用API
  exam: examRouter, // IPA試験設定API
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
