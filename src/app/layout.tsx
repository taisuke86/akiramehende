import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

export const metadata: Metadata = {
  title: "Study Tracker",
  description: "勉強時間を記録・管理するアプリケーション",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <SessionProvider>
          <TRPCReactProvider>
            <Header />
            <main className="pt-4 flex-1">
              {children}
            </main>
            <Footer />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
