# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Claude Code Configuration
## Conversation GuideLines
- 常に日本語で会話する

## web検索で利用するツール
- Web Searchは使わない。
- gemini-cliをグローバルインストールしているので、webでの検索はgoogle_web_searchを利用する。
- .claude/commands/gemini-search.mdにweb検索について記載しているので確認すること。

## 作業中のタイムアウトエラーについて
- 120秒ではなく、100秒でタイムアウトエラーとしてください。

## 修正の際の注意点
- 修正を行う際には必ず以下のことに順守してください
- 修正過程で.claude/settings.jsonのdenyの各コマンドを実行する必要がある場合は、ユーザーに対し適宜指示してください。
- 該当修正によって他の処理に問題がないか慎重に確認を行って作業を行ってください。
- 他の動作に関しても修正が必要な場合は既存の期待値の動作が正常に起動するように修正してください。

## Project Overview
This is a **Study Tracker** application built with the T3 Stack (Next.js 15, TypeScript, tRPC, Prisma, NextAuth.js, Tailwind CSS). It tracks study sessions with optional user authentication via Google OAuth.

## Development Commands

**Package Manager:** pnpm

**Core Development:**
- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build for production
- `pnpm preview` - Build and start production server
- `pnpm check` - Run linting and type checking

**Database:**
- `pnpm db:generate` - Generate Prisma client and run migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio

**Code Quality:**
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format:check` - Check Prettier formatting
- `pnpm format:write` - Format code with Prettier

## Architecture

**T3 Stack Structure:**
- **Next.js 15 App Router** with React Server Components
- **tRPC** for type-safe API layer in `src/server/api/`
- **Prisma** ORM with PostgreSQL database
- **NextAuth.js v5** for authentication (Google OAuth configured)
- **Tailwind CSS v4** for styling

**Key Directories:**
- `src/app/` - Next.js App Router pages and components
- `src/server/api/routers/` - tRPC API route handlers
- `src/server/auth/` - Authentication configuration
- `prisma/` - Database schema and migrations

## Database Schema

**Core Models:**
- `StudySession` - Main entity (id, subject, duration, date, memo, optional userId)
- `User` - NextAuth.js user model with study session relationship
- `Account/Session` - NextAuth.js authentication tables

**Database:** PostgreSQL (connection via `DATABASE_URL`)

## Environment Variables

Required for development:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js authentication secret
- `NEXTAUTH_URL` - NextAuth.js application URL (usually http://localhost:3000)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials

## Current Implementation

**Implemented Features:**
- Study session CRUD operations via tRPC
- Form validation with Zod
- Responsive UI with Tailwind CSS
- Google OAuth setup (not enforced)
- PostgreSQL database with Prisma

**API Endpoints:**
- `studySessions.getAll` - Fetch all study sessions
- `studySessions.create` - Create new study session

**Development Notes:**
- UI text and comments are in Japanese
- Type-safe development with strict TypeScript
- Optimistic UI updates with React Query
- Authentication ready but not fully integrated with study sessions