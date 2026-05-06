# Architecture Overview: Prompt-to-Form

This document outlines the architectural patterns and principles used in the Prompt-to-Form codebase. The system is designed for high scalability, maintainability, and clear separation of concerns.

## 🏛️ The "Service-Worker-SQL" Pattern

We follow a modular 3-tier architecture for our backend logic. Every domain module (e.g., `Forms`, `Fields`, `Submissions`) is broken down into three distinct files:

### 1. SQL Layer (`*.sql.ts`)
**Responsibility:** Pure data persistence.
- Contains raw database queries (Supabase/PostgreSQL).
- No business logic or authorization checks.
- If we switch databases, this is the **only** file that changes.
- *Example:* `FormsSql.findFormBySlug(slug)`

### 2. Worker Layer (`*.worker.ts`)
**Responsibility:** Heavy lifting and background tasks.
- Handles long-running or CPU-intensive operations (AI generation, translations).
- Orchestrates external API calls (Google Gemini).
- Designed to be easily offloaded to a task queue (e.g., BullMQ) in production.
- *Example:* `FormsWorker.generateForm(prompt)`

### 3. Service Layer (`*.service.ts`)
**Responsibility:** The "Brain" / Orchestrator.
- Implements business logic and cross-module orchestration.
- Enforces authorization and ownership checks.
- Does not know about Express `req`/`res` objects or raw HTTP.
- *Example:* `FormsService.duplicateForm(accessToken, formId, userId)`

---

## 📡 API Routing (Lean Controllers)

Express routes act as thin wrappers (controllers). They are responsible for:
1. Parsing request parameters.
2. Validating input (via Zod).
3. Calling the appropriate **Service** method.
4. Sending the correct HTTP response status and JSON.

**Strict Rule:** No direct database calls or complex logic are allowed inside the route files.

---

## 🎨 Frontend: Domain-Component Decomposition

The frontend follows a "Domain-First" component structure to avoid massive page files. Pages like `FormEditor.tsx` are decomposed into specialized sub-components located in `src/components/[domain]/`.

### Key Component Types:
- **Domain Components:** (e.g., `FieldList`, `AnalyticsDashboard`) Handle logic specific to a business domain.
- **UI Primitives:** (e.g., `Button`, `Input`) Reusable, stateless styling components from Radix UI / Shadcn.
- **Layouts:** Manage consistent page structures (e.g., `DashboardLayout`).

---

## 🔐 Security Model

- **Row Level Security (RLS):** Enabled in Supabase as the first line of defense.
- **Service Layer Validation:** Every destructive or private operation in the Service layer validates the `userId` against the object's owner.
- **Admin Bypass:** Use the `AdminClient` sparingly, only within the Service layer for cross-user operations (like public submissions).

---

## 🤖 AI Integration Strategy

We treat AI as an **unreliable worker**. 
- All AI calls are encapsulated in the `Worker` layer.
- Systems are built to handle AI "hallucinations" or invalid JSON responses gracefully through Zod validation and structured retry logic.
