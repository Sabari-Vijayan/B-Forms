# GEMINI.md - AI Navigation & Project Map

This project is a standalone **Next.js** application for the **Prompt-to-Form** platform.

---

## 🏗️ Architectural Overview

- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion, Radix UI.
- **Backend:** Next.js API Routes (`app/api/`).
- **Database:** Supabase (PostgreSQL).
- **AI:** NVIDIA NIM (`moonshotai/kimi-k2.6`).

---

## 🗺️ Project Structure

- `app/`: Next.js pages and API routes.
- `components/`: UI and business components.
- `hooks/`: Custom React hooks, including `hooks/api.ts` for data fetching.
- `lib/`: Shared utility functions and constants.
  - `lib/api.ts`: Client-side fetch wrapper.
  - `lib/server/`: Server-side logic (Supabase client, AI, Services).
- `public/`: Static assets.

---

## 🔍 Search Guide

- **API Routes:** `app/api/`
- **Business Logic (Server):** `lib/server/modules/`
- **AI Prompts & Logic:** `lib/server/ai.ts`
- **Database Operations:** `lib/server/modules/**/*.sql.ts`
- **UI Components:** `components/`

---

## 🛠️ Key Commands

- `npm run dev`: Start the development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.
