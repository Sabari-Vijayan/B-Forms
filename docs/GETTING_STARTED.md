# Getting Started

Follow these steps to set up the project locally.

## 📋 Prerequisites
* **Node.js**: Version 24 or later
* **pnpm**: Version 9 or later
* **Supabase Account**: For database and authentication
* **Google Gemini API Key**: For AI features

## ⚙️ Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Asset-Builder
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Variables**:
   Create a `.env` file in `artifacts/api-server` and `artifacts/prompt-to-form` (or a root `.env` if using a tool that supports it).

   **Backend (`artifacts/api-server/.env`)**:
   ```env
   DATABASE_URL=your_supabase_postgresql_url
   GEMINI_API_KEY=your_gemini_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Frontend (`artifacts/prompt-to-form/.env`)**:
   ```env
   VITE_API_URL=/api
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Migration**:
   Run the content of `supabase-migration.sql` in the Supabase SQL Editor.

## 🚀 Running Locally

From the root directory:

```bash
# Run everything (API Server + Frontend)
pnpm run dev
```

The frontend will usually be available at `http://localhost:5173` and the API at `http://localhost:5000`.

## 🛠️ Common Tasks

* **Typecheck all packages**: `pnpm run typecheck`
* **Build all packages**: `pnpm run build`
* **Regenerate API code**: `pnpm --filter @workspace/api-spec run codegen`
