"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

// StudySession型定義
// type StudySession = {
//   id: string;
//   subject: string;
//   duration: number;
//   date: Date | string;
//   memo?: string | null;
//   createdAt: Date | string;
//   updatedAt: Date | string;
//   userId?: string | null;
// };

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { status } = useSession();
  
  // マウント状態の管理
  useEffect(() => {
    setMounted(true);
  }, []);

  // ログイン時のみクエリを実行
  const { 
    data: studySessions, 
    isLoading, 
    error 
  } = api.studySessions.getAll.useQuery(undefined, {
    enabled: mounted && status === "authenticated", // ログイン時のみ実行
  });

  // サーバーサイドレンダリング時の表示
  if (!mounted) {
    return (
      <div className="container mx-auto p-4">
        <div className="w-full max-w-md mx-auto">
          <h1 className="mb-8 text-center text-3xl font-bold">Study Tracker</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // クライアントサイドレンダリング後の表示
  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="mb-8 text-center text-3xl font-bold">Study Tracker</h1>
        
        {/* 勉強記録フォーム - ログイン時のみ表示 */}
        {status === "authenticated" && (
          <StudySessionForm />
        )}
        
        {/* 勉強記録一覧 - ログイン時のみ表示 */}
        {status === "authenticated" && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">勉強記録</h2>
            
            {isLoading && (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500">
                エラー: {error.message}
              </div>
            )}
            
            {studySessions && studySessions.length === 0 && (
              <p className="text-gray-500">まだ勉強記録がありません</p>
            )}
            
            {studySessions?.map((session) => (
              <div key={session.id} className="mb-4 p-4 border rounded-lg">
                <h3 className="font-semibold">{session.subject}</h3>
                <p className="text-gray-600">{session.duration}分</p>
                <p className="text-gray-500 text-sm">
                  {new Date(session.date).toLocaleDateString('ja-JP')}
                </p>
                {session.memo && (
                  <p className="text-gray-700 text-sm mt-2">{session.memo}</p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* 未ログイン時のメッセージ */}
        {status === "unauthenticated" && (
          <div className="mt-8 text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">勉強記録を始めましょう</h3>
            <p className="text-gray-500 mb-4">ログインして勉強時間の記録と管理を開始してください</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 勉強記録フォームコンポーネント
function StudySessionForm() {
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [memo, setMemo] = useState("");

  const utils = api.useUtils();
  const createStudySession = api.studySessions.create.useMutation({
    onSuccess: () => {
      // 成功時にキャッシュを更新
      void utils.studySessions.getAll.invalidate();
      // フォームをリセット
      setSubject("");
      setDuration("");
      setMemo("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.length > 0 && duration.length > 0) {
      createStudySession.mutate({
        subject,
        duration: parseInt(duration),
        memo: memo || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">科目</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="例: 数学"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">時間（分）</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="例: 60"
          min="1"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">メモ（任意）</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="感想や気づきなど"
          rows={3}
        />
      </div>
      
      <button
        type="submit"
        disabled={createStudySession.isPending}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {createStudySession.isPending ? "保存中..." : "記録を保存"}
      </button>
    </form>
  );
}