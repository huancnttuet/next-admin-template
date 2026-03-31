import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AppRoutes } from '@/configs/routes';
import { authenticateUser, createLoginResult } from '@/repos/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Credentials ────────────────────────────────────────
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await authenticateUser(
          credentials.email,
          credentials.password,
        );
        if (!user) return null;

        const loginResult = await createLoginResult(user);
        return {
          ...user,
          accessToken: loginResult.accessToken,
        };
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
      if (user) {
        token.id = user.id;
        token.accessToken =
          (user as typeof user & { accessToken?: string }).accessToken ||
          token.accessToken;
        token.roleIds =
          (user as typeof user & { roleIds?: string[] }).roleIds || [];
        token.permissions =
          (user as typeof user & { permissions?: string[] }).permissions || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roleIds = (token.roleIds as string[] | undefined) || [];
        session.user.permissions =
          (token.permissions as string[] | undefined) || [];
      }
      session.accessToken = token.accessToken as string | undefined;
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
      roleIds: string[];
      permissions: string[];
    };
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string;
    roleIds?: string[];
    permissions?: string[];
  }
}
