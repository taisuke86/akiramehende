"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { formatDateJST, getCurrentJSTDate, formatDateForInput } from "~/lib/dateUtils";

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

// StudySession型定義（編集モーダル用）
type StudySession = {
  id: string;
  subject: string;
  duration: number;
  date: Date | string;
  memo?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId?: string | null;
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState("");
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [deletingSession, setDeletingSession] = useState<StudySession | null>(null);
  const { status } = useSession();

  const utils = api.useUtils();

  // 励ましメッセージの配列
  const messages = useMemo(() => [
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
  ], []);

  // マウント状態の管理
  useEffect(() => {
    setMounted(true);
    // ページアクセス時にランダムメッセージを設定
    const getRandomMessage = (): string => {
      return messages[Math.floor(Math.random() * messages.length)] ?? "今日の頑張りを入力してね！";
    };
    setMotivationMessage(getRandomMessage());
  }, [messages]);

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
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">学習記録</h2>
            
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
              <p className="text-gray-500 dark:text-gray-400">まだ学習記録がありません</p>
            )}
            
            {studySessions?.map((session) => (
              <div key={session.id} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{session.subject}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{session.duration}分</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDateJST(session.date)}
                    </p>
                    {session.memo && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{session.memo}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setEditingSession(session)}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => setDeletingSession(session)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 編集モーダル */}
        {editingSession && (
          <EditSessionModal
            session={editingSession}
            onClose={() => setEditingSession(null)}
            onSuccess={() => {
              setEditingSession(null);
              void utils.studySessions.getAll.invalidate();
            }}
          />
        )}
        
        {/* 削除確認ダイアログ */}
        {deletingSession && (
          <DeleteConfirmDialog
            session={deletingSession}
            onClose={() => setDeletingSession(null)}
            onSuccess={() => {
              setDeletingSession(null);
              void utils.studySessions.getAll.invalidate();
            }}
          />
        )}
        
        {/* 未ログイン時のメッセージ */}
        {status === "unauthenticated" && (
          <div className="mt-4 text-center p-4  sm:p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
            <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-2 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Let&apos;s Study</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">ログインして勉強時間の<br />記録と管理を開始してください</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 編集モーダルコンポーネント
function EditSessionModal({ session, onClose, onSuccess }: {
  session: StudySession;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [subject, setSubject] = useState(session.subject);
  const [duration, setDuration] = useState(session.duration.toString());
  const [date, setDate] = useState(() => {
    return formatDateForInput(session.date);
  });
  const [memo, setMemo] = useState(session.memo ?? "");

  const updateStudySession = api.studySessions.update.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.length > 0 && duration.length > 0) {
      const jstDate = new Date(date + 'T00:00:00+09:00');
      
      updateStudySession.mutate({
        id: session.id,
        subject,
        duration: parseInt(duration),
        date: jstDate,
        memo: memo ? memo : undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">学習記録を編集</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">科目</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 dark:bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={updateStudySession.isPending}
                className="flex-1 bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {updateStudySession.isPending ? "更新中..." : "更新"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 削除確認ダイアログコンポーネント
function DeleteConfirmDialog({ session, onClose, onSuccess }: {
  session: StudySession;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const deleteStudySession = api.studySessions.delete.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleDelete = () => {
    deleteStudySession.mutate({ id: session.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">学習記録を削除</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
{session.subject}の学習記録を削除しますか？この操作は取り消せません。
          </p>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 dark:bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteStudySession.isPending}
              className="flex-1 bg-red-500 dark:bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {deleteStudySession.isPending ? "削除中..." : "削除"}
            </button>
          </div>
        </div>
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
        memo: memo ? memo : undefined,
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