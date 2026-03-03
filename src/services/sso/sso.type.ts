/** SSO token response from the KAPI OAuth2 server */
export interface SSOTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
}

/** User profile returned from the SSO /userinfo or /me endpoint */
export interface SSOUserProfile {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
  permissions: string[];
}
