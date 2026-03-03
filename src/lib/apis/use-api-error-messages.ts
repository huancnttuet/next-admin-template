import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { setTranslatedStatusMessages } from './api-error';

/**
 * Builds a `Record<statusCode, translatedMessage>` from the `apiErrors`
 * i18n namespace and **syncs** it into the module-level store so that
 * non-React code (e.g. Axios interceptors in `proxy-client`) can also
 * display translated error messages.
 *
 * Mount this hook once near the top of the component tree
 * (e.g. inside a provider or layout) to keep translations in sync.
 * It can also be called from individual components that pass
 * `statusMessages` to `getErrorMessage()` explicitly.
 */
export function useApiErrorMessages(): Record<number, string> {
  const t = useTranslations('apiErrors');

  const messages = useMemo(
    () => ({
      // 400: t('badRequest'), --- IGNORE ---
      401: t('unauthorized'),
      403: t('forbidden'),
      404: t('notFound'),
      405: t('methodNotAllowed'),
      409: t('conflict'),
      422: t('unprocessableEntity'),
      429: t('tooManyRequests'),
      500: t('internalServerError'),
      502: t('badGateway'),
      503: t('serviceUnavailable'),
    }),
    [t],
  );

  // Keep the module-level store in sync with the current locale
  useEffect(() => {
    setTranslatedStatusMessages(messages);
  }, [messages]);

  return messages;
}
