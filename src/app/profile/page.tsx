"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ユーザープロフィールを取得
  const { data: profile, isLoading } = api.user.getProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  // プロフィール取得完了時にニックネームをセット
  if ((profile as any)?.nickname && nickname !== (profile as any).nickname) {
    setNickname((profile as any).nickname);
  }

  // ニックネーム更新用のmutation
  const utils = api.useUtils();
  const updateNickname = api.user.updateNickname.useMutation({
    onSuccess: () => {
      void utils.user.getProfile.invalidate();
      setIsEditing(false);
    },
  });

  // ニックネーム削除用のmutation
  const clearNickname = api.user.clearNickname.useMutation({
    onSuccess: () => {
      void utils.user.getProfile.invalidate();
      setNickname("");
      setIsEditing(false);
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
        <div className="max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveNickname = () => {
    if (nickname.trim().length === 0) {
      return;
    }
    updateNickname.mutate({ nickname: nickname.trim() });
  };

  const handleClearNickname = () => {
    clearNickname.mutate();
  };

  const handleCancel = () => {
    setNickname((profile as any)?.nickname ?? "");
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>

        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">基本情報</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ニックネーム
              </label>
              {!isEditing ? (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 bg-gray-50 p-2 rounded flex-1">
                    {(profile as any)?.nickname ?? "未設定"}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    編集
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="ニックネームを入力"
                    maxLength={50}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveNickname}
                      disabled={updateNickname.isPending || nickname.trim().length === 0}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updateNickname.isPending ? "保存中..." : "保存"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                    {(profile as any)?.nickname && (
                      <button
                        onClick={handleClearNickname}
                        disabled={clearNickname.isPending}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        削除
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {updateNickname.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-600 text-sm">
              {updateNickname.error.message}
            </p>
          </div>
        )}

        {/* 表示名について */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">表示名について</h3>
          <p className="text-sm text-blue-700">
            ニックネームを設定すると、アプリ内での表示名として使用されます。
            未設定の場合はメールアドレスが表示されます。
          </p>
        </div>

        {/* 戻るボタン */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
}