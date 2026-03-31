import { compare } from 'bcryptjs';
import { getUsersCollection } from '@/repos/users';
import { mapAuthUserDocument } from './utils';
import type { AuthUser } from './types';

export async function findAuthUserByEmail(email: string) {
  const collection = await getUsersCollection();
  const normalizedEmail = email.trim().toLowerCase();
  const doc = await collection.findOne({ email: normalizedEmail });
  return doc ?? null;
}

export async function validateAuthUserCredentials(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const doc = await findAuthUserByEmail(email);
  if (!doc || !doc.passwordHash || doc.isLock) {
    return null;
  }

  const matched = await compare(password, doc.passwordHash);
  if (!matched) {
    return null;
  }

  return await mapAuthUserDocument(doc);
}
