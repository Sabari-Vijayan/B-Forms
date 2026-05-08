# Technology Stack

We use a modern, type-safe stack designed for speed and scalability.

## 💻 Frontend
* **Framework**: React 19 (Vite)
* **Styling**: Tailwind CSS 4, Shadcn UI
* **State Management**: TanStack React Query (server state), Wouter (routing)
* **Form Handling**: React Hook Form, Zod
* **Interactions**: Framer Motion, @dnd-kit (drag and drop)
* **Icons**: Lucide React

## ⚙️ Backend
* **Framework**: Express 5
* **Language**: TypeScript
* **Logging**: Pino / pino-http
* **AI Engine**: NVIDIA NIM (moonshotai/kimi-k2.6 via native Fetch)
* **Validation**: Zod (via generated schemas)

## 🗄️ Database & Auth
* **Provider**: Supabase
* **Engine**: PostgreSQL
* **ORM**: Drizzle ORM
* **Auth**: Supabase Auth (Magic Link)
* **Real-time**: Supabase Realtime for submission updates

## 🤖 AI Models
* **Primary Model**: Google Gemini 1.5 Flash (`gemini-1.5-flash-latest`)
* **Functions**: Form generation from prompts, field translation, response translation.

## 🛠️ Tooling
* **Package Manager**: pnpm
* **API Spec**: OpenAPI 3.1
* **Codegen**: Orval (OpenAPI to React Query + Zod)
* **Build**: esbuild (for server)
