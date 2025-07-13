# あきらめへんで

学習時間を記録・管理するWebアプリケーション

## 概要

あきらめへんでは、個人の学習活動を効率的に記録・管理することを目的としたシンプルなWebアプリケーションです。

## 主な機能

- **学習記録**: 科目、時間、日付、メモの記録
- **IPA試験対応**: 試験日設定と学習計画の自動計算
- **学習統計**: 月別グラフによる学習記録の可視化
- **Google認証**: 安全なログイン機能（オプション）
- **プロフィール**: ニックネーム設定
- **管理者機能**: ユーザー管理とデータ管理
- **ダークモード**: 視認性に配慮したテーマ切り替え

## 技術スタック

- Next.js 15 (App Router)
- NextAuth.js v5 (Google OAuth)
- Prisma + PostgreSQL (Supabase)
- tRPC
- Tailwind CSS v4

## プライバシー

このアプリは**プライバシー・バイ・デザイン**の原則に基づいて設計されており、必要最小限の情報（メールアドレスのみ）で動作します。

詳細は以下をご確認ください：
- [利用規約](/terms)
- [プライバシーポリシー](/privacy)

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/[あなたのユーザー名]/akiramehende.git
cd akiramehende
```

### 2. 依存関係のインストール
```bash
pnpm install
```

### 3. 環境変数の設定
```bash
# .env.exampleファイルをコピー
cp .env.example .env

# .envファイルを編集
# 必要に応じて以下を設定：
# - DATABASE_URL (SQLite推奨: "file:./dev.db")
# - NEXTAUTH_SECRET (npx auth secret で生成)
# - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (Google認証を使用する場合)
# - ADMIN_EMAILS (管理者メールアドレス)
```

### 4. データベースの設定
```bash
# Prismaクライアント生成とデータベース作成
pnpm db:push
```

### 5. 開発サーバーの起動
```bash
pnpm dev
```

アプリケーションが http://localhost:3000 で利用可能になります。

## 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm preview

# リントとタイプチェック
pnpm check

# データベース管理
pnpm db:studio  # Prisma Studio起動
```

## ライセンス

このプロジェクトはオープンソースです。

## お問い合わせ

[GitHub Issues](https://github.com/taisuke86/akiramehende/issues) でお気軽にお問い合わせください。