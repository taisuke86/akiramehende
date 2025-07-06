"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { formatDateJST } from "~/lib/dateUtils";
import { IPA_EXAMS, getLevelLabel, getLevelColor } from "~/lib/examMaster";

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "exam" | "settings">("dashboard");
  const [nickname, setNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // IPA試験設定用の状態
  const [selectedExam, setSelectedExam] = useState("");
  const [examDate, setExamDate] = useState("");
  const [weekdayHours, setWeekdayHours] = useState("");
  const [weekendHours, setWeekendHours] = useState("");

  // ユーザープロフィールを取得
  const { data: profile, isLoading } = api.user.getProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  // ダッシュボードデータを取得
  const { data: monthlyStats } = api.dashboard.getMonthlyStats.useQuery({}, {
    enabled: status === "authenticated" && activeTab === "dashboard",
  });

  const { data: goalProgress } = api.dashboard.getGoalProgress.useQuery(undefined, {
    enabled: status === "authenticated" && activeTab === "dashboard",
  });

  // IPA試験設定データを取得
  const { data: examSettings } = api.exam.getExamSettings.useQuery(undefined, {
    enabled: status === "authenticated" && (activeTab === "exam" || activeTab === "dashboard"),
  });

  // 学習計画データを取得
  const { data: studyPlan } = api.exam.getStudyPlan.useQuery(undefined, {
    enabled: status === "authenticated" && activeTab === "exam",
  });

  // プロフィール取得完了時にニックネームをセット
  if ((profile as { nickname?: string })?.nickname && nickname !== (profile as { nickname?: string }).nickname) {
    setNickname((profile as { nickname?: string }).nickname!);
  }

  // 試験設定の初期化
  if (examSettings && selectedExam === "") {
    const settings = examSettings as any;
    setSelectedExam(settings.targetExam ?? "");
    const examDateValue = settings.examDate;
    setExamDate(examDateValue ? new Date(examDateValue).toISOString().split('T')[0] ?? "" : "");
    const weekdayValue = settings.weekdayStudyHours;
    const weekendValue = settings.weekendStudyHours;
    setWeekdayHours(weekdayValue ? String(weekdayValue) : "");
    setWeekendHours(weekendValue ? String(weekendValue) : "");
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

  // アカウント削除用のmutation
  const deleteAccount = api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      // セッションを無効化してログアウト
      await signOut({ callbackUrl: "/" });
    },
  });

  // 試験設定更新用のmutation
  const updateExamSettings = api.exam.updateExamSettings.useMutation({
    onSuccess: () => {
      void utils.exam.getExamSettings.invalidate();
      void utils.dashboard.getGoalProgress.invalidate();
      void utils.exam.getStudyPlan.invalidate();
    },
  });

  // 試験設定クリア用のmutation
  const clearExamSettings = api.exam.clearExamSettings.useMutation({
    onSuccess: () => {
      void utils.exam.getExamSettings.invalidate();
      void utils.dashboard.getGoalProgress.invalidate();
      void utils.exam.getStudyPlan.invalidate();
      setSelectedExam("");
      setExamDate("");
      setWeekdayHours("");
      setWeekendHours("");
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
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
    setNickname((profile as { nickname?: string })?.nickname ?? "");
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    deleteAccount.mutate();
    setShowDeleteConfirm(false);
  };

  const handleSaveExamSettings = () => {
    if (selectedExam && examDate && weekdayHours && weekendHours) {
      updateExamSettings.mutate({
        targetExam: selectedExam,
        examDate: new Date(examDate),
        weekdayStudyHours: parseFloat(weekdayHours),
        weekendStudyHours: parseFloat(weekendHours),
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">マイページ</h1>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              📊 ダッシュボード
            </button>
            <button
              onClick={() => setActiveTab("exam")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "exam"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              📚 試験設定
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              ⚙️ プロフィール設定
            </button>
          </nav>
        </div>

        {/* ダッシュボードタブ */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* 学習目標進捗 */}
            {goalProgress && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                {goalProgress.type === 'exam' ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {goalProgress.examInfo.name} 対策
                      </h2>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(goalProgress.examInfo.level)}`}>
                        {getLevelLabel(goalProgress.examInfo.level)}
                      </div>
                    </div>
                    
                    {goalProgress.isExamPassed ? (
                      <div className="text-center py-4">
                        <p className="text-gray-600 dark:text-gray-400">試験日が過ぎています</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {goalProgress.daysUntilExam}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">日後</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {goalProgress.progressPercentage}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">進捗</div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${goalProgress.progressPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="font-medium">学習済み:</span> {goalProgress.totalStudiedHours.toFixed(1)}h
                          </div>
                          <div>
                            <span className="font-medium">目標:</span> {goalProgress.targetHours}h
                          </div>
                          <div>
                            <span className="font-medium">今週:</span> {goalProgress.thisWeekHours.toFixed(1)}h
                          </div>
                          <div>
                            <span className="font-medium">週目標:</span> {goalProgress.weeklyTargetHours.toFixed(1)}h
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">今月の学習目標</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">進捗</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {goalProgress.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${goalProgress.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{goalProgress.thisMonthDuration}分 / {goalProgress.monthlyGoal}分</span>
                        <span>残り{goalProgress.remainingDuration}分</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 今月の統計 */}
            {monthlyStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">総学習時間</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {monthlyStats.totalDuration}分
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.floor(monthlyStats.totalDuration / 60)}時間{monthlyStats.totalDuration % 60}分
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">学習回数</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {monthlyStats.totalSessions}回
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      平均 {monthlyStats.averageDuration}分/回
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">学習科目</h3>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {monthlyStats.subjectStats.length}科目
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {monthlyStats.year}年{monthlyStats.month}月
                    </p>
                  </div>
                </div>

                {/* 科目別統計 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">科目別学習時間</h2>
                  <div className="space-y-3">
                    {monthlyStats.subjectStats.map((stat, index) => (
                      <div key={stat.subject} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-blue-800 dark:text-blue-300 text-sm font-semibold">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{stat.subject}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {stat.duration}分
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.sessions}回
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最近の学習記録 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">最近の学習記録</h2>
                  <div className="space-y-3">
                    {monthlyStats.recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{session.subject}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDateJST(session.date)}
                          </p>
                          {session.memo && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{session.memo}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {session.duration}分
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* IPA試験設定タブ */}
        {activeTab === "exam" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">IPA試験設定</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    目標試験
                  </label>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  >
                    <option value="">試験を選択してください</option>
                    {IPA_EXAMS.map((exam) => (
                      <option key={exam.code} value={exam.code}>
                        {exam.name} ({exam.recommendedHours}時間)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    試験日
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      平日の学習時間（時間/日）
                    </label>
                    <input
                      type="number"
                      value={weekdayHours}
                      onChange={(e) => setWeekdayHours(e.target.value)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                      placeholder="2.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      休日の学習時間（時間/日）
                    </label>
                    <input
                      type="number"
                      value={weekendHours}
                      onChange={(e) => setWeekendHours(e.target.value)}
                      min="0"
                      max="24"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                      placeholder="4.0"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveExamSettings}
                    disabled={updateExamSettings.isPending || !selectedExam || !examDate || !weekdayHours || !weekendHours}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateExamSettings.isPending ? "保存中..." : "保存"}
                  </button>
                  
                  {examSettings && (
                    <button
                      onClick={() => clearExamSettings.mutate()}
                      disabled={clearExamSettings.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {clearExamSettings.isPending ? "クリア中..." : "設定をクリア"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 学習計画表示 */}
            {studyPlan && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">学習計画</h3>
                
                {studyPlan.isExamPassed ? (
                  <p className="text-gray-600 dark:text-gray-400">試験日が過ぎています</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {studyPlan.daysUntilExam}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">日後</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {studyPlan.totalAvailableHours?.toFixed(0) ?? "0"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">利用可能時間</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {studyPlan.progressPercentage?.toFixed(0) ?? "0"}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">進捗</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {studyPlan.weeklyAverageHours?.toFixed(1) ?? "0.0"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">週平均時間</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          学習進捗
                        </span>
                        <span className={`text-sm font-medium ${
                          studyPlan.isOnTrack 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {studyPlan.isOnTrack ? '順調' : '要努力'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${studyPlan.progressPercentage ?? 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span>{studyPlan.completedHours?.toFixed(1) ?? "0.0"}h / {studyPlan.examInfo.recommendedHours}h</span>
                        <span>残り {studyPlan.remainingHours?.toFixed(1) ?? "0.0"}h</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* エラー表示 */}
            {updateExamSettings.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {updateExamSettings.error.message}
                </p>
              </div>
            )}
          </div>
        )}

        {/* プロフィール設定タブ */}
        {activeTab === "settings" && (
          <div className="max-w-md mx-auto space-y-6">
            {/* 基本情報 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">基本情報</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ニックネーム
                  </label>
                  {!isEditing ? (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded flex-1">
                        {(profile as { nickname?: string })?.nickname ?? "未設定"}
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
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
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
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
                          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                          キャンセル
                        </button>
                        {(profile as { nickname?: string })?.nickname && (
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    メールアドレス
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* エラー表示 */}
            {updateNickname.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {updateNickname.error.message}
                </p>
              </div>
            )}

            {/* 表示名について */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">表示名について</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ニックネームを設定すると、アプリ内での表示名として使用されます。
                未設定の場合はメールアドレスが表示されます。
              </p>
            </div>

            {/* アカウント削除 */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">アカウント削除</h2>
              <div className="space-y-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  アカウントを削除すると、全ての学習記録とプロフィール情報が完全に削除されます。
                  この操作は取り消すことができません。
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  アカウントを削除
                </button>
              </div>
            </div>

            {/* 削除確認モーダル */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4">
                    アカウント削除の確認
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    本当にアカウントを削除しますか？
                    <br />
                    <strong className="text-red-600 dark:text-red-400">全ての学習記録が完全に削除され、復旧できません。</strong>
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteAccount.isPending}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleteAccount.isPending ? "削除中..." : "削除する"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* エラー表示 */}
            {deleteAccount.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  削除エラー: {deleteAccount.error.message}
                </p>
              </div>
            )}
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