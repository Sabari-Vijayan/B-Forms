# Architecture

Prompt-to-Form is built as a **pnpm monorepo**, ensuring tight integration between the API, frontend, and shared libraries.

## 🏗️ System Overview

The system consists of several key layers:

1. **Frontend (Vite + React)**: The main user interface for creating, managing, and filling out forms.
2. **Backend (Express 5)**: A REST API that handles form logic, AI integration, and database interactions.
3. **Database (Supabase/PostgreSQL)**: Stores form definitions, translations, and submissions. Uses Row Level Security (RLS) for data protection.
4. **AI (Google Gemini)**: Powers form generation and multilingual translation.
5. **Shared Libraries**: Internal packages for API specifications, Zod schemas, and React hooks.

## 📦 Monorepo Structure

```text
.
├── artifacts/
│   ├── api-server/         # Express backend
│   ├── prompt-to-form/     # Main React frontend
│   └── mockup-sandbox/     # Component development environment
├── lib/
│   ├── api-spec/           # OpenAPI 3.1 definition (source of truth)
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── api-client-react/   # Generated React Query hooks from OpenAPI
│   └── db/                 # Database connection and Drizzle setup
└── scripts/                # Utility scripts
```

## 🔄 Development Workflow

The project follows a **Spec-First API Development** approach:
1. Define/update endpoints in `lib/api-spec/openapi.yaml`.
2. Run `pnpm run codegen` to regenerate Zod schemas and React hooks.
3. Implement the backend logic in `artifacts/api-server`.
4. Use the generated hooks in `artifacts/prompt-to-form`.

This ensures the frontend and backend are always in sync with the API specification.
