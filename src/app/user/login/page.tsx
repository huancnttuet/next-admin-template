'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { buildSSOLogoutUrl } from '@/configs/sso';

/**
 * ### NOTE
 * Hiện tại do hệ thống SSO của IIG Vietnam chỉ hỗ trợ một số redirect URI nhất định:
 *     "redirectUris": [
 *       "http://localhost:4001/callback",
 *       "http://localhost:3000/user/login",
 *       "http://localhost:5174/callback",
 *       "https://tfc-admin.iigvietnam.com/callback"
 *     ],
 * Nên tạm thời tạo trang callback này để xử lý việc redirect từ SSO.
 * Trang này nhận authorization code từ KAPI rồi gọi signIn('sso', { code })
 * để NextAuth thực hiện token exchange và tạo session.
 * Sau này nếu có thể cấu hình redirect URI linh hoạt hơn thì có thể bỏ trang này đi.
 */

/**
 * SSO Callback Page (Client Component)
 *
 * The SSO IdP (KAPI) redirects here with ?code=xxx after authentication.
 * This page calls NextAuth's signIn('sso') with the code so the server-side
 * CredentialsProvider can exchange it for tokens and create a session.
 */
export default function SSOCallbackPage() {
  const searchParams = useSearchParams();
  const t = useTranslations('auth');
  const [status, setStatus] = useState('');
  const processedCodeRef = useRef<string | null>(null);

  useEffect(() => {
    setStatus(t('ssoCallbackInitializing'));
  }, [t]);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      window.location.href = `/sign-in?error=${encodeURIComponent(error)}`;
      return;
    }

    if (!code) {
      window.location.href = '/sign-in?error=missing_code';
      return;
    }

    // Prevent processing the same code twice (React strict mode)
    // but allow processing a NEW code (retry with different account)
    if (processedCodeRef.current === code) return;
    processedCodeRef.current = code;

    async function handleSSOCallback(authCode: string) {
      try {
        // Clear any stale session before attempting SSO sign-in
        const existingSession = await getSession();
        if (existingSession) {
          await signOut({ redirect: false });
        }

        setStatus(t('ssoCallbackExchanging'));

        const result = await signIn('sso', {
          code: authCode,
          redirect: false,
        });

        if (result?.error) {
          // After a successful KAPI login, CredentialsSignin means the
          // user profile fetch failed (most likely User.NotFound in the backend).
          const errorCode =
            result.error === 'CredentialsSignin'
              ? 'User.NotFound'
              : result.error;

          // Clear local NextAuth session
          await signOut({ redirect: false }).catch(() => {});

          // Redirect to KAPI logout to clear the SSO session,
          // then KAPI redirects back to /sign-in?error=...
          window.location.href = buildSSOLogoutUrl(errorCode);
        } else {
          window.location.href = '/';
        }
      } catch {
        await signOut({ redirect: false }).catch(() => {});
        window.location.href = buildSSOLogoutUrl('sso_callback_failed');
      }
    }

    handleSSOCallback(code);
  }, [searchParams]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='size-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
        <p className='text-sm text-muted-foreground'>{status}</p>
      </div>
    </div>
  );
}
