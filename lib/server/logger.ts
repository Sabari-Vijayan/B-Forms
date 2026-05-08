import pino from "pino";

// In Next.js API routes, pino-pretty transport can cause "worker thread exited" errors 
// because it uses worker_threads which might not be correctly bundled/handled by Next.js.
// Standardizing on simple JSON logging to ensure stability.
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});
