/**
 * SSO (Single Sign-On) configuration.
 *
 * Uses OAuth2 Authorization Code flow with IIG Vietnam's KAPI identity provider.
 * All values are sourced from environment variables for per-environment flexibility.
 */
export const SSOConfig = {
  /** OAuth2 token endpoint */
  tokenUrl:
    process.env.NEXT_PUBLIC_SSO_TOKEN_API ||
    'https://kapi.iigvietnam.com/api/oauth/token',

  /** SSO login page URL (user is redirected here to authenticate) */
  loginPage:
    process.env.NEXT_PUBLIC_SSO_LOGIN_PAGE ||
    'https://kapiadmin.iigvietnam.com',

  /** SSO logout URL (includes redirect back to the app) */
  logoutPage:
    process.env.NEXT_PUBLIC_SSO_LOGOUT_PAGE ||
    'https://kapiadmin.iigvietnam.com/logout?redirect_url=http://localhost:3000/sign-in',

  /** SSO change-password page */
  changePasswordPage:
    process.env.NEXT_PUBLIC_SSO_CHANGE_PASSWORD_PAGE ||
    'https://kapiadmin.iigvietnam.com/change-password?redirect_url=http://localhost:3000',

  /** OAuth2 client ID */
  clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID || 'tfc_admin',

  /** OAuth2 redirect URI — must match the value registered with the identity provider */
  redirectUri:
    process.env.NEXT_PUBLIC_SSO_REDIRECT_URI ||
    'http://localhost:3000/user/login',

  /** OAuth2 scopes */
  scope: process.env.NEXT_PUBLIC_SSO_SCOPE || 'openid profile email',

  /** Return URL after logout (optional, depends on IdP config) */
  returnUrl: process.env.NEXT_PUBLIC_SSO_RETURN_URL || 'http://localhost:3000',

  /** User profile endpoint (if different from standard OIDC userinfo) */
  profileUrl:
    process.env.NEXT_PUBLIC_SSO_PROFILE_URL ||
    'http://10.11.10.13:7040/api/auth/profile',
} as const;

/**
 * Build the full SSO authorization URL for redirecting the user to the IdP login page.
 */
export function buildSSOAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: SSOConfig.clientId,
    redirect_uri: SSOConfig.redirectUri,
    scope: SSOConfig.scope,
    response_type: 'code',
    ...(state ? { state } : {}),
  });

  return `${SSOConfig.loginPage}/authorize?${params.toString()}`;
}

/**
 * Build the SSO logout URL that clears the IdP session and redirects
 * back to the sign-in page, optionally with an error code.
 */
export function buildSSOLogoutUrl(error?: string): string {
  const logoutPage = SSOConfig.logoutPage;

  if (!error) return logoutPage;

  // The logoutPage already contains redirect_url=...
  // Append the error param to that redirect URL
  try {
    const url = new URL(logoutPage);
    const redirectUrl = url.searchParams.get('redirect_url');
    if (redirectUrl) {
      const target = new URL(redirectUrl);
      target.searchParams.set('error', error);
      url.searchParams.set('redirect_url', target.toString());
    }
    return url.toString();
  } catch {
    // Fallback: just append error to the logout page
    const separator = logoutPage.includes('?') ? '&' : '?';
    return `${logoutPage}${separator}error=${encodeURIComponent(error)}`;
  }
}
