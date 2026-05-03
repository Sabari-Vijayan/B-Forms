# Deployment

## 🌐 Deployment Strategy

The application is split into three main components that can be deployed independently.

### 1. API Server (`api-server`)
* **Platform**: Any Node.js hosting (Replit, Render, Railway, Vercel Functions).
* **Build**: Run `pnpm run build` in `artifacts/api-server`.
* **Execution**: Run `node dist/index.mjs`.
* **Note**: Ensure all environment variables (DB, Gemini, Supabase) are set in the production environment.

### 2. Frontend (`prompt-to-form`)
* **Platform**: Static site hosting (Vercel, Netlify, GitHub Pages).
* **Build**: Run `pnpm run build` in `artifacts/prompt-to-form`.
* **Execution**: Deploy the resulting `dist/` folder.
* **Configuration**: Set `VITE_API_URL` to point to your deployed API server.

### 3. Database & Auth (Supabase)
* No additional deployment needed if you are using the Supabase Cloud.
* Ensure RLS policies are active.
* Configure the translation webhook to point to the production API URL.

## 🧪 Production Checklist
1. Enable SSL on all endpoints.
2. Use production-grade logging (Pino is already configured).
3. Set up rate limiting on the `/api/ai/generate` endpoint.
4. Verify that the `SUPABASE_SERVICE_ROLE_KEY` is ONLY used on the server.
5. Disable `pnpm` workspace development features in production builds.
