"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { formatDateJST, getCurrentJSTDate } from "~/lib/dateUtils";

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
  const [motivationMessage, setMotivationMessage] = useState("");
  const { status } = useSession();

  // 励ましメッセージの配列
  const messages = [
    "今日の頑張りを入力してね！",
    "今日も一歩前進しよう！",
    "学習記録で成長を実感しよう！",
    "今日の努力が明日の自信に！",
    "コツコツ続けることが大切だよ！",
    "今日はどんなことを学んだ？",
    "小さな積み重ねが大きな成果に！",
    "今日の学習をしっかり記録しよう！",
    "継続は力なり！今日も頑張って！",
    "毎日の学習が夢への第一歩！",
    "今日学んだことを記録に残そう！",
    "努力した時間を大切にしよう！",
    "Let's record your effort today!",
    "Every small step counts!"
  ];

  // ランダムメッセージを選択する関数
  const getRandomMessage = (): string => {
    return messages[Math.floor(Math.random() * messages.length)] ?? "今日の頑張りを入力してね！";
  };
  
  // マウント状態の管理
  useEffect(() => {
    setMounted(true);
    // ページアクセス時にランダムメッセージを設定
    setMotivationMessage(getRandomMessage());
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
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">今日の頑張りを入力してね！</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // クライアントサイドレンダリング後の表示
  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">{motivationMessage}</h1>
        
        {/* 勉強記録フォーム - ログイン時のみ表示 */}
        {status === "authenticated" && (
          <StudySessionForm />
        )}
        
        {/* 勉強記録一覧 - ログイン時のみ表示 */}
        {status === "authenticated" && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">勉強記録</h2>
            
            {isLoading && (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 dark:text-red-400">
                エラー: {error.message}
              </div>
            )}
            
            {studySessions && studySessions.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">まだ勉強記録がありません</p>
            )}
            
            {studySessions?.map((session) => (
              <div key={session.id} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">{session.subject}</h3>
                <p className="text-gray-600 dark:text-gray-300">{session.duration}分</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatDateJST(session.date)}
                </p>
                {session.memo && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{session.memo}</p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* 未ログイン時のメッセージ */}
        {status === "unauthenticated" && (
          <div className="mt-8 text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">勉強記録を始めましょう</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">ログインして勉強時間の<br />記録と管理を開始してください</p>
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
  const [date, setDate] = useState(() => {
    // 初期値として今日の日付（日本時間）をセット
    const today = getCurrentJSTDate();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD形式
  });
  const [memo, setMemo] = useState("");

  const utils = api.useUtils();
  const createStudySession = api.studySessions.create.useMutation({
    onSuccess: () => {
      // 成功時にキャッシュを更新
      void utils.studySessions.getAll.invalidate();
      // フォームをリセット
      setSubject("");
      setDuration("");
      setDate(() => {
        const today = getCurrentJSTDate();
        return today.toISOString().split('T')[0];
      });
      setMemo("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.length > 0 && duration.length > 0) {
      // 日付を日本時間として解釈してUTCに変換
      const jstDate = new Date(date + 'T00:00:00+09:00');
      
      createStudySession.mutate({
        subject,
        duration: parseInt(duration),
        date: jstDate,
        memo: memo || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">科目</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例: OAuth,仮想化"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">時間（分）</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例: 60"
          min="1"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">メモ（任意）</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="感想や気づきなど"
          rows={3}
        />
      </div>
      
      <button
        type="submit"
        disabled={createStudySession.isPending}
        className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {createStudySession.isPending ? "保存中..." : "記録を保存"}
      </button>
    </form>
  );
}