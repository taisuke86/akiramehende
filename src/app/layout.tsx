import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

export const metadata: Metadata = {
  title: "あきらめへんで",
  description: "学習時間を記録・管理するアプリケーション - IPA試験対応",
  icons: {
    icon: [
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" }
    ]
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${geist.variable} dark`}>
      <body className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <SessionProvider>
          <TRPCReactProvider>
            {/* 固定ヘッダー */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <Header />
            </div>
            {/* メインコンテンツ（ヘッダー分のマージンを追加） */}
            <main className="pt-16 flex-1 px-4">
              {children}
            </main>
            <Footer />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
