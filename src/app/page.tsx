"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function HomePage() {
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // tRPC mutations と queries
  const createStudySession = api.studySessions.create.useMutation();
  const { data: studySessions, refetch } = api.studySessions.getAll.useQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // エラーをクリア
    setErrors({});
    
    createStudySession.mutate({
      subject,
      duration: parseInt(duration),
      memo: memo || undefined,
    }, {
      onSuccess: () => {
        // 成功時の処理
        setSubject("");
        setDuration("");
        setMemo("");
        setErrors({});
        refetch(); // データを再取得
        console.log("✅勉強記録を保存しました")
      },
      onError: (error) => {
        // サーバサイドエラーの処理
        console.error("❌保存エラー:", error);
        console.log("🔍 エラーオブジェクト全体:", JSON.stringify(error, null, 2));

        // エラー解析の改善版
        const newErrors: {[key: string]: string} = {};

        // Method 1: error.data?.zodError 形式のチェック
        if (error.data?.zodError?.fieldErrors) {
          const fieldErrors = error.data.zodError.fieldErrors;
          
          Object.keys(fieldErrors).forEach(field => {
            const fieldErrorArray = fieldErrors[field];
            if (Array.isArray(fieldErrorArray) && fieldErrorArray.length > 0) {
              const firstError = fieldErrorArray[0];
              if (typeof firstError === 'string') {
                newErrors[field] = firstError;
              }
            }
          });
        }

        // Method 2: error.shape?.data?.zodError 形式のチェック
        else if (error.shape?.data?.zodError?.fieldErrors) {
          const fieldErrors = error.shape.data.zodError.fieldErrors;
          
          Object.keys(fieldErrors).forEach(field => {
            const fieldErrorArray = fieldErrors[field];
            if (Array.isArray(fieldErrorArray) && fieldErrorArray.length > 0) {
              const firstError = fieldErrorArray[0];
              if (typeof firstError === 'string') {
                newErrors[field] = firstError;
              }
            }
          });
        }

        // Method 3: 直接エラー配列形式のチェック（TRPCClientError）
        else if (error.message && error.message.includes('[')) {
          try {
            // エラーメッセージからJSON部分を抽出
            const match = error.message.match(/\[[\s\S]*\]/);
            if (match) {
              const errorArray = JSON.parse(match[0]);
              
              if (Array.isArray(errorArray)) {
                errorArray.forEach((err: any) => {
                  if (err.path && Array.isArray(err.path) && err.path.length > 0) {
                    const fieldName = err.path[0];
                    if (typeof fieldName === 'string' && typeof err.message === 'string') {
                      newErrors[fieldName] = err.message;
                    }
                  }
                });
              }
            }
          } catch (parseError) {
            console.error("エラーパース失敗:", parseError);
          }
        }

        // Method 4: フォールバック - 汎用エラー
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = error.message || "保存に失敗しました。もう一度お試しください。";
        }

        setErrors(newErrors);
        console.log("🔍 最終的なエラー:", newErrors);
      },
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        高みを目指す者たちの記録簿
      </h1>

      {/* 勉強記録入力フォーム */}
      <div className="max-w-md mx-auto mb-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* 全般エラーメッセージ */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              科目・分野
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                // 入力時にエラーをクリア
                if (errors.subject) {
                  setErrors(prev => ({...prev, subject: ""}));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: OAuth2.0、ロシア語"
            />
            {errors.subject && (
              <p className="text-red-600 text-sm mt-1">
                🚫 {errors.subject}
              </p>
            )}            
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              勉強時間（分）
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                // 入力時にエラーをクリア
                if (errors.duration){
                  setErrors(prev => ({ ...prev, duration: "" }));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 60"
            />
            {errors.duration && (
              <p className="text-red-600 text-sm mt-1">
                🚫 {errors.duration}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              メモ・感想（任意）
            </label>
            <textarea
              value={memo}
              onChange={(e) => {
                setMemo(e.target.value);
                // 入力時にエラーをクリア
                if (errors.memo){
                  setErrors(prev => ({ ...prev, memo: ""}));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.memo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="今日学んだこと、感想など"
              rows={3}
            />
            {errors.memo && (
              <p className="text-red-600 text-sm mt-1">
                🚫 {errors.memo}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={createStudySession.isPending}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createStudySession.isPending ? "記録中..." : "記録を追加"}
          </button>
        </form>

        {/* デバッグ情報（開発時のみ表示） */}
        {process.env.NODE_ENV === 'development' && Object.keys(errors).length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <p className="font-semibold mb-1">🔧 Debug: エラー情報</p>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* 勉強記録一覧 */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">勉強記録一覧</h2>
        
        {studySessions && studySessions.length > 0 ? (
          <div className="space-y-4">
            {studySessions.map((session) => (
              <div key={session.id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{session.subject}</h3>
                  <span className="text-blue-600 font-semibold">
                    {session.duration}分
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {new Date(session.date).toLocaleDateString('ja-JP')}
                </p>
                {session.memo && (
                  <p className="text-gray-700">{session.memo}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            まだ勉強記録がありません。上のフォームから記録を追加してみてください。
          </p>
        )}
      </div>
    </main>
  );
}