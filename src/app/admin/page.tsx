"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type User = {
  id: string;
  email: string | null;
  nickname: string | null;
  _count: {
    studySessions: number;
  };
};

export default function AdminPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 管理者権限チェック用クエリ
  const { data: users, isLoading, error } = api.admin.getAllUsers.useQuery(undefined, {
    enabled: status === "authenticated",
    retry: false,
  });

  const { data: stats } = api.admin.getStats.useQuery(undefined, {
    enabled: status === "authenticated" && !error,
  });

  const { data: userDetails } = api.admin.getUserDetails.useQuery(
    { userId: selectedUserId! },
    { enabled: !!selectedUserId }
  ) as { data: { 
    id: string; 
    email: string | null; 
    nickname: string | null; 
    studySessions: Array<{
      id: string;
      subject: string;
      duration: number;
      date: Date;
      memo: string | null;
    }>;
  } | undefined };

  // ユーザー削除用mutation
  const utils = api.useUtils();
  const deleteUser = api.admin.deleteUser.useMutation({
    onSuccess: () => {
      void utils.admin.getAllUsers.invalidate();
      void utils.admin.getStats.invalidate();
      setDeleteConfirmId(null);
      setSelectedUserId(null);
    },
  });

  // 未ログインの場合はリダイレクト
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  // ローディング状態
  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // 権限エラーの場合
  if (error?.data?.code === "FORBIDDEN") {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              アクセス拒否
            </h1>
            <p className="text-red-700 mb-4">
              管理者権限が必要です。
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate({ userId });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">管理者ダッシュボード</h1>

        {/* 統計情報 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">総ユーザー数</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.userCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">総学習記録数</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.sessionCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">総学習時間</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalDuration}分</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ユーザー一覧 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ユーザー一覧</h2>
            </div>
            <div className="p-6">
              {users && users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user: any) => (
                    <div
                      key={user.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedUserId === user.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                      }`}
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.nickname || user.email || "名前なし"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            学習記録: {user._count.studySessions}件
                          </p>
                        </div>
                        {user.id === session?.user?.id ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded dark:bg-blue-900/30 dark:text-blue-300">
                            管理者（あなた）
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(user.id);
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                          >
                            削除
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">ユーザーがいません。</p>
              )}
            </div>
          </div>

          {/* ユーザー詳細 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ユーザー詳細</h2>
            </div>
            <div className="p-6">
              {selectedUserId && userDetails ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">基本情報</h3>
                    <p className="text-gray-700 dark:text-gray-300"><strong>ID:</strong> {userDetails.id}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>メール:</strong> {userDetails.email}</p>
                    <p className="text-gray-700 dark:text-gray-300"><strong>ニックネーム:</strong> {userDetails.nickname || "未設定"}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">学習記録 ({userDetails.studySessions.length}件)</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {userDetails.studySessions.map((session: any) => (
                        <div key={session.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border dark:border-gray-600">
                          <p className="text-gray-900 dark:text-white"><strong>{session.subject}</strong> - {session.duration}分</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(session.date).toLocaleDateString("ja-JP")}
                          </p>
                          {session.memo && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{session.memo}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">ユーザーを選択してください。</p>
              )}
            </div>
          </div>
        </div>

        {/* 削除確認モーダル */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">
                ユーザー削除の確認
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                このユーザーとすべての学習記録を削除しますか？
                <br />
                <strong className="text-red-600 dark:text-red-400">この操作は取り消せません。</strong>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeleteUser(deleteConfirmId)}
                  disabled={deleteUser.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  {deleteUser.isPending ? "削除中..." : "削除する"}
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* エラー表示 */}
        {deleteUser.error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">
              削除エラー: {deleteUser.error.message}
            </p>
          </div>
        )}

        {/* 戻るボタン */}
        <div className="mt-8">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}