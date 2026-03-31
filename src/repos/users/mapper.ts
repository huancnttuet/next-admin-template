import type { User } from '@/features/users';
import type { UserDocument } from './types';

export function mapUserDocument(doc: UserDocument): User {
  if (!doc._id) {
    throw new Error('Invalid user document');
  }

  return {
    id: doc._id.toHexString(),
    fullName: doc.fullName,
    userName: doc.userName,
    email: doc.email,
    isVerify: doc.isVerify,
    isLock: doc.isLock,
  };
}
