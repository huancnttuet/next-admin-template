import { SSOConfig } from '@/configs/sso';
import type { SSOTokenResponse, SSOUserProfile } from './sso.type';

/**
 * Exchange an authorization code for tokens via the SSO token endpoint.
 */
export async function exchangeSSOCode(code: string): Promise<SSOTokenResponse> {
  const tokenResponse = await fetch(SSOConfig.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grantType: 'authorization_code',
      code,
      clientId: SSOConfig.clientId,
      redirectUri: SSOConfig.redirectUri,
    }),
    cache: 'no-store',
  });

  if (!tokenResponse.ok) {
    throw new Error('SSO token exchange failed');
  }

  const tokenData: SSOTokenResponse = await tokenResponse.json();

  return tokenData;
}

/**
 * Refresh an access token using a refresh token.
 */
export async function refreshSSOToken(
  refreshToken: string,
): Promise<SSOTokenResponse> {
  const res = await fetch(SSOConfig.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grantType: 'refresh_token',
      refreshToken,
      clientId: SSOConfig.clientId,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('SSO token refresh failed');
  }

  return res.json();
}

/**
 * Fetch the user profile from the SSO server using an access token.
 * Tries the standard OpenID Connect userinfo endpoint.
 */
export async function fetchSSOUserProfile(
  accessToken: string,
): Promise<SSOUserProfile> {
  const res = await fetch(SSOConfig.profileUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let errorCode = `profile_fetch_failed_${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData?.code) errorCode = errorData.code;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(errorCode);
  }

  return res.json();
}
