import { encode } from 'next-auth/jwt';
import { getAdminCredentials } from './utils';
import type { AuthUser, LoginResult } from './types';
import { validateAuthUserCredentials } from './queries';

const JWT_EXPIRES_IN_SECONDS = 60 * 60 * 24;

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const adminCredentials = getAdminCredentials();

  if (
    normalizedEmail === adminCredentials.email.trim().toLowerCase() &&
    password === adminCredentials.password
  ) {
    return {
      id: '1',
      name: 'Admin User',
      email: adminCredentials.email,
      image: '/avatars/01.png',
      roleIds: [],
      permissions: ['*'],
    };
  }

  return await validateAuthUserCredentials(normalizedEmail, password);
}

export async function createLoginResult(user: AuthUser): Promise<LoginResult> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is required');
  }

  const accessToken = await encode({
    secret,
    maxAge: JWT_EXPIRES_IN_SECONDS,
    token: {
      sub: user.id,
      name: user.name,
      email: user.email,
      picture: user.image,
      roleIds: user.roleIds,
      permissions: user.permissions,
    },
  });

  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: JWT_EXPIRES_IN_SECONDS,
    user,
  };
}

export async function resolveLoginResultForEmail(
  email: string,
  password: string,
): Promise<LoginResult | null> {
  const user = await authenticateUser(email, password);
  if (!user) return null;
  return await createLoginResult(user);
}
