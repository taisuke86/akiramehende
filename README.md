# Study Tracker

学習時間を記録・管理するWebアプリケーション

## 概要

Study Trackerは、個人の学習活動を効率的に記録・管理することを目的としたシンプルなWebアプリケーションです。

## 主な機能

- **学習記録**: 科目、時間、日付、メモの記録
- **Google認証**: 安全なログイン機能
- **プロフィール**: ニックネーム設定
- **データ管理**: 個人の学習データの管理

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

## 開発

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# データベース設定
pnpm db:generate
pnpm db:push
```

## ライセンス

このプロジェクトはオープンソースです。

## お問い合わせ

[GitHub Issues](https://github.com/taisuke86/study-tracker-app/issues) でお気軽にお問い合わせください。