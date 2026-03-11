import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AppRoutes } from '@/configs/routes';

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
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
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
  }
}
