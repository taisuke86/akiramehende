"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  // ユーザープロフィールを取得してニックネームを表示
  const { data: profile } = api.user.getProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  // 管理者権限チェック（エラーは無視）
  const { data: isAdmin } = api.admin.getStats.useQuery(undefined, {
    enabled: status === "authenticated",
    retry: false,
    throwOnError: false,
  });

  // 表示名を決定する関数
  const getDisplayName = () => {
    if (profile?.nickname) return profile.nickname;
    return session?.user?.email ?? "";
  };


  // スマホ用短縮表示関数
  const getShortDisplayName = () => {
    const name = getDisplayName();
    if (name.length > 8) {
      return name.substring(0, 8) + '...';
    }
    return name;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ・タイトル */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
              あきらめへんで
            </Link>
          </div>

          {/* 右側のユーザーメニュー */}
          <div className="flex items-center space-x-4">
            {status === "loading" && (
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              </div>
            )}

            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </div>
                  {/* スマホ表示 */}
                  <span className="text-gray-700 dark:text-gray-300 block sm:hidden">{getShortDisplayName()}</span>
                  {/* PC表示 */}
                  <span className="text-gray-700 dark:text-gray-300 hidden sm:block">{getDisplayName()}</span>
                  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                        <div className="font-medium text-center">{getDisplayName()}</div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        マイページ
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-t border-gray-200 dark:border-gray-600"
                        >
                          管理者ダッシュボード
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          void signOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>ログイン</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ドロップダウンが開いているときの背景クリック用オーバーレイ */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
}