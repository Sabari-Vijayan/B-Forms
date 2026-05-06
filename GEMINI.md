# GEMINI.md - AI Navigation & Project Map

This file is optimized for AI agents to navigate the **Prompt-to-Form** monorepo with minimal context usage. It defines "Sources of Truth" and dependency chains.

---

## 🗺️ Source of Truth Map

If you are modifying the following, **start at the Source of Truth**:

| Requirement | Source of Truth | Affected Downstream |
| :--- | :--- | :--- |
| **API Contracts** | `lib/api-spec/openapi.yaml` | `lib/api-zod`, `lib/api-client-react`, Backend Routes |
| **DB Schema** | `lib/db/src/schema/index.ts` | `supabase-migration.sql`, Backend SQL layers |
| **Aesthetics/UI** | `artifacts/mockup-sandbox/` | `artifacts/prompt-to-form/src/components/ui/` |
| **AI Prompts** | `artifacts/api-server/src/lib/ai.ts` | AI Generation & Translation behavior |

---

## 🏗️ Architectural Chains (The "What affects What")

### 1. API Flow (Spec-First)
Changes to `openapi.yaml` **require** running `pnpm --filter @workspace/api-spec run codegen`.
- **Validation:** Backend routes use `api-zod` for request parsing.
- **Client:** Frontend uses `api-client-react` (TanStack Query) for all data fetching.

### 2. Backend Logic (3-Tier Modular)
Located in `artifacts/api-server/src/modules/`:
- `routes/*.ts`: Entry points, authentication, and request/response mapping.
- `*.service.ts`: Business logic, coordination between multiple SQL/Worker units.
- `*.worker.ts`: (Optional) Long-running or complex async tasks (e.g., AI generation).
- `*.sql.ts`: Raw Supabase/PostgREST queries. **Always use explicit column selection** (avoid `.select("*")`) to prevent schema cache errors.

### 3. Database Updates
- Local changes in `lib/db` must be reflected in `supabase-migration.sql`.
- When adding tables, always include:
    - Table definition.
    - RLS Policies (Enable RLS by default).
    - Required RPC functions for atomic operations.

---

## 🔍 Search Guide: "Where to Look"

- **Adding a new API endpoint?**
    1. `lib/api-spec/openapi.yaml` (Define it)
    2. `artifacts/api-server/src/routes/` (Implement it)
- **Fixing a UI bug?**
    - `artifacts/prompt-to-form/src/components/` (Components)
    - `artifacts/prompt-to-form/src/pages/` (Routes/Layout)
- **Changing AI behavior?**
    - `artifacts/api-server/src/lib/ai.ts` (Model config & System prompts)
- **Modifying form fields/types?**
    - `lib/api-zod` (Zod schemas)
    - `lib/db/src/schema/` (Database types)
- **Checking Auth logic?**
    - `artifacts/api-server/src/lib/auth.ts` (Middleware & JWT)

---

## 🛠️ Performance & Context Constraints

1. **Surgical Reads:** Do not read entire directories. Use `grep_search` to find symbols, then `read_file` with `start_line`/`end_line`.
2. **Model Lock:** AI operations MUST use `gemini-2.5-flash-lite`. Do not downgrade or upgrade without explicit instruction.
3. **Implicit Relations:** If you see `Could not find a relationship` errors, the issue is usually in the PostgREST cache; fix by using explicit `.select("col1, col2")`.
4. **Tooling:** Use `pnpm run dev` in the root to start the full stack. Backend runs on `:5000`, Frontend/Vite Proxy on `:5173`.
