import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 - Study Tracker",
  description: "Study Trackerの利用規約",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Study Tracker 利用規約</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">最終更新日: 2025年7月2日</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第1条（本規約の適用）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>本規約は、Study Tracker（以下「本サービス」といいます）の利用に関する条件を定めるものです。</li>
            <li>ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第2条（サービス内容）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>本サービスは、学習時間の記録・管理を目的とした個人向けWebアプリケーションです。</li>
            <li>主な機能は以下の通りです：
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>学習セッションの記録・管理</li>
                <li>学習データの可視化</li>
                <li>Googleアカウントによる認証</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第3条（利用登録）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>本サービスの利用には、Googleアカウントによる認証が必要です。</li>
            <li>利用登録時に虚偽の情報を提供してはなりません。</li>
            <li>登録情報に変更があった場合は、速やかに更新してください。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第4条（利用規則）</h2>
          <p className="mb-4">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>法令または公序良俗に反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>他のユーザーまたは第三者の権利を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>不正アクセスその他の不正行為</li>
            <li>虚偽情報の登録・提供</li>
            <li>その他、当方が不適切と判断する行為</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第5条（個人情報の取扱い）</h2>
          <p>個人情報の取扱いについては、別途定める「<a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>」に従います。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第6条（知的財産権）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>本サービスに関する知的財産権は、すべて運営者に帰属します。</li>
            <li>ユーザーが本サービスに投稿したコンテンツの権利は、ユーザーに帰属します。</li>
            <li>ユーザーは、投稿したコンテンツについて、本サービスの提供に必要な範囲で利用することを許諾するものとします。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第7条（サービスの変更・停止）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>運営者は、事前の通知なく本サービスの内容を変更することができます。</li>
            <li>運営者は、以下の場合にサービスを一時的に停止することができます：
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>システムメンテナンスを行う場合</li>
                <li>障害が発生した場合</li>
                <li>その他、運営上必要と判断した場合</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第8条（利用制限・停止）</h2>
          <p>運営者は、ユーザーが本規約に違反した場合、事前の通知なくサービスの利用を制限または停止することができます。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第9条（免責事項）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>運営者は、本サービスに関して、明示または黙示を問わず、いかなる保証も行いません。</li>
            <li>運営者は、本サービスの利用により発生した損害について、一切の責任を負いません。</li>
            <li>本サービスは無料で提供されており、運営者の責任は限定されます。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第10条（データの取扱い）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>ユーザーは、自身の学習データについて責任を負います。</li>
            <li>運営者は、データの消失に対して責任を負いません。</li>
            <li>ユーザーは、必要に応じて自身でデータのバックアップを行ってください。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第11条（規約の変更）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>運営者は、必要に応じて本規約を変更することができます。</li>
            <li>変更後の規約は、本サービス上での掲示により効力を生じます。</li>
            <li>変更後も本サービスを継続利用した場合、変更に同意したものとみなします。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第12条（準拠法・管轄裁判所）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>本規約は日本法を準拠法とします。</li>
            <li>本サービスに関する紛争については、運営者の住所地を管轄する裁判所を専属的合意管轄とします。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第13条（お問い合わせ）</h2>
          <p>本規約に関するお問い合わせは、本サービス内のお問い合わせフォームまたは<a href="https://github.com/taisuke86/study-tracker-app/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHubリポジトリのIssues</a>にてお願いします。</p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            <strong>Study Tracker運営者</strong><br />
            最終更新日: 2025年7月2日
          </p>
        </div>
      </div>
    </div>
  );
}