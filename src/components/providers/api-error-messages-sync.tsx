'use client';

import { useApiErrorMessages } from '@/lib/apis/use-api-error-messages';

/**
 * Invisible component that syncs translated API error messages
 * into the module-level store so Axios interceptors (proxy-client)
 * can display locale-aware error toasts.
 *
 * Mount once inside the Providers tree (after next-intl context).
 */
export function ApiErrorMessagesSync() {
  useApiErrorMessages();
  return null;
}
