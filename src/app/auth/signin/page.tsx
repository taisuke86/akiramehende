"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-4 sm:space-y-8 border-0">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            あきらめへんで にログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            学習記録を管理するためにログインしてください
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {/* 利用規約・プライバシーポリシー同意 */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms-agreement"
                    name="terms-agreement"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms-agreement" className="text-gray-700 dark:text-gray-300">
                    <Link 
                      href="/terms" 
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      利用規約
                    </Link>
                    および
                    <Link 
                      href="/privacy" 
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      プライバシーポリシー
                    </Link>
                    に同意します
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              disabled={!agreedToTerms}
              className={`group relative w-80 mx-auto flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 ${
                agreedToTerms 
                  ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Googleでログイン
            </button>
            
            {!agreedToTerms && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                ログインするには利用規約とプライバシーポリシーに同意してください
              </p>
            )}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}