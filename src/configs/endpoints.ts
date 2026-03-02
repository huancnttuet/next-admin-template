/**
 * Centralized API endpoint configuration.
 *
 * Each entry maps a logical service name to its base URL,
 * sourced from environment variables with sensible defaults.
 *
 * To add a new API:
 *   1. Add a `NEXT_PUBLIC_<NAME>_API_URL` env variable to `.env.*` files
 *   2. Add a new entry here
 *   3. Create a client via `createApiClient(ApiEndpoints.<name>)`
 */
export const ApiEndpoints = {
  /** Primary backend API */
  main: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',

  // ── Add more APIs below ──────────────────────────────────
  // auth: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8081/api',
  // media: process.env.NEXT_PUBLIC_MEDIA_API_URL || 'http://localhost:8082/api',
  // notification: process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || 'http://localhost:8083/api',
} as const;

export type ApiEndpointKey = keyof typeof ApiEndpoints;
