import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  exchangeSSOCode,
  fetchSSOUserProfile,
  refreshSSOToken,
} from '@/services/sso';
import { AppRoutes } from '@/configs/routes';

export const authOptions: NextAuthOptions = {
  providers: [
    // ── SSO (IIG Vietnam KAPI) ─────────────────────────────
    // Uses CredentialsProvider instead of OAuthProvider because
    // KAPI only supports fixed redirect URIs (/user/login).
    // The /user/login page receives the code and calls signIn('sso', { code }).
    CredentialsProvider({
      id: 'sso',
      name: 'SSO',
      credentials: {
        code: { label: 'Authorization Code', type: 'text' },
      },
      async authorize(credentials) {
        const code = credentials?.code;
        if (!code) return null;

        try {
          // Exchange authorization code for tokens
          const tokens = await exchangeSSOCode(code);

          // Fetch user profile from the SSO server
          const profile = await fetchSSOUserProfile(tokens.accessToken);

          // Return user object with embedded SSO tokens
          // These will be picked up in the jwt callback
          return {
            id: profile.userId,
            name: profile.userName,
            email: profile.email,
            image: '/avatars/01.png',
            // Custom fields for SSO token storage
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + tokens.expiresIn,
            provider: 'sso',
          };
        } catch (error) {
          console.error(
            '[SSO] authorize failed:',
            error instanceof Error ? error.message : error,
          );
          return null;
        }
      },
    }),

    // ── Credentials (development / fallback) ───────────────
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Replace with actual API call
        if (
          credentials?.email === 'admin@example.com' &&
          credentials?.password === 'password'
        ) {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            image: '/avatars/01.png',
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: AppRoutes.SignIn,
    error: AppRoutes.SignIn,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;

        // Persist SSO tokens from the enriched user object
        const ssoUser = user as typeof user & {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: number;
          provider?: string;
        };
        if (ssoUser.provider === 'sso') {
          token.accessToken = ssoUser.accessToken;
          token.refreshToken = ssoUser.refreshToken;
          token.accessTokenExpires = ssoUser.expiresAt;
          token.provider = 'sso';
        }
      }

      // Refresh SSO token if expired
      if (
        token.provider === 'sso' &&
        token.accessTokenExpires &&
        Date.now() / 1000 > (token.accessTokenExpires as number) - 60
      ) {
        try {
          const refreshed = await refreshSSOToken(token.refreshToken as string);
          token.accessToken = refreshed.accessToken;
          token.refreshToken = refreshed.refreshToken ?? token.refreshToken;
          token.accessTokenExpires =
            Math.floor(Date.now() / 1000) + refreshed.expiresIn;
        } catch {
          // If refresh fails, mark the token as expired so the user is re-authenticated
          token.error = 'RefreshTokenError';
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      // Expose provider & access token to client when needed
      session.provider = token.provider as string | undefined;
      session.accessToken = token.accessToken as string | undefined;
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    provider?: string;
    accessToken?: string;
    error?: string;
  }
}
