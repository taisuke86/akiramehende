import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー - あきらめへんで",
  description: "あきらめへんでのプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">あきらめへんで プライバシーポリシー</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">最終更新日: 2025年7月2日</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
          <p>あきらめへんで（以下「本サービス」）では、ユーザーのプライバシーを重視し、個人情報の適切な保護に努めています。本プライバシーポリシーは、本サービスにおける個人情報の取扱いについて説明します。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 収集する情報</h2>
          
          <h3 className="text-xl font-semibold mb-3">2.1 Googleアカウント情報</h3>
          <p className="mb-3">本サービスでは、Google OAuth認証を通じて以下の情報を取得します：</p>
          
          <p className="mb-2"><strong>使用する情報：</strong></p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>メールアドレス（ユーザー識別・認証用）</li>
            <li>Google アカウント ID（内部識別子）</li>
          </ul>
          
          <p className="mb-2"><strong>取得するが使用しない情報：</strong></p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>氏名（NextAuth.js要件のため取得、使用せず）</li>
            <li>プロフィール画像（NextAuth.js要件のため取得、使用せず）</li>
          </ul>
          <p className="text-sm text-gray-600 mb-4">
            ※ 氏名・画像は認証ライブラリの仕様上取得されますが、アプリ内では使用していません。
          </p>

          <h3 className="text-xl font-semibold mb-3">2.2 学習データ</h3>
          <p className="mb-3">ユーザーが入力する以下の学習関連情報：</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>学習科目・分野</li>
            <li>学習時間（分単位）</li>
            <li>学習日付（日本時間で管理）</li>
            <li>メモ・感想（任意）</li>
            <li>ニックネーム（任意）</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.3 技術的情報</h3>
          <p className="mb-3">サービス提供のために自動的に収集される情報：</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>IPアドレス</li>
            <li>ブラウザの種類・バージョン</li>
            <li>アクセス日時</li>
            <li>利用状況に関する統計情報</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 情報の利用目的</h2>
          <p className="mb-3">収集した個人情報は、以下の目的で利用します：</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>ユーザー認証・識別</li>
            <li>学習記録の保存・表示・管理</li>
            <li>サービス機能の提供</li>
            <li>サービスの品質向上・障害対応</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. 情報の共有・提供</h2>
          
          <h3 className="text-xl font-semibold mb-3">4.1 第三者への提供</h3>
          <p className="mb-3">以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません：</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>ユーザーの明確な同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>緊急事態において生命・身体の安全を守るために必要な場合</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">4.2 業務委託</h3>
          <p className="mb-3">サービス提供のために以下の第三者サービスを利用しています：</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong>Google OAuth</strong>: 認証サービス</li>
            <li><strong>Supabase</strong>: データベースサービス</li>
            <li><strong>Vercel</strong>: ホスティングサービス</li>
          </ul>
          <p>これらのサービスプロバイダーには、各社のプライバシーポリシーが適用されます。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. データの保存・セキュリティ</h2>
          
          <h3 className="text-xl font-semibold mb-3">5.1 保存場所</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>データベース: Supabase（PostgreSQL）</li>
            <li>ホスティング: Vercel</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">5.2 セキュリティ対策</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>全通信のTLS/SSL暗号化</li>
            <li>Google OAuth認証</li>
            <li>ユーザー別データ分離</li>
            <li>定期バックアップ</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">5.3 保存期間</h3>
          <p>アカウント削除まで継続保存し、削除後は速やかに削除します。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. ユーザーの権利</h2>
          
          <h3 className="text-xl font-semibold mb-3">6.1 データへのアクセス</h3>
          <p className="mb-3">ユーザーは、自身の個人情報について以下の権利を有します：</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>データの確認・閲覧</li>
            <li>データの修正・更新</li>
            <li>データの削除・利用停止</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6.2 アカウント削除</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Googleアカウントの連携解除により、いつでもサービス利用を停止可能</li>
            <li>アカウント削除後、関連するデータは合理的な期間内に削除</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookie・類似技術</h2>
          
          <h3 className="text-xl font-semibold mb-3">7.1 使用目的</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>ユーザー認証状態の維持</li>
            <li>サービス設定の保存</li>
            <li>利用分析・改善</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">7.2 管理方法</h3>
          <p>ユーザーは、ブラウザ設定により Cookie を無効化できますが、一部機能が利用できなくなる場合があります。</p>
        </section>


        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. プライバシーポリシーの変更</h2>
          
          <p className="mb-3">本ポリシーは必要に応じて更新される場合があります。重要な変更がある場合は、サービス内で通知します。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. お問い合わせ</h2>
          <p className="mb-3">個人情報の取扱いに関するお問い合わせは、<a href="https://github.com/taisuke86/akiramehende/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub Issues</a> でお願いします。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. 準拠法</h2>
          <p>本プライバシーポリシーは、日本法に準拠します。</p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-6">
            <strong>あきらめへんで 運営者</strong><br />
            最終更新日: 2025年7月2日
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">参考情報</h3>
            <p className="text-sm text-gray-600 mb-2">本サービスで使用している第三者サービスのプライバシーポリシー：</p>
            <ul className="text-sm space-y-1">
              <li>• <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google プライバシーポリシー</a></li>
              <li>• <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase プライバシーポリシー</a></li>
              <li>• <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel プライバシーポリシー</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}