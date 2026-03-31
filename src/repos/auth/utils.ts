import { ALL_PERMISSIONS } from '@/configs/rbac';
import { getPermissionsByRoleIds } from '@/repos/roles';
import type { UserDocument } from '@/repos/users';
import type { AuthUser } from './types';

export const PASSWORD_SALT_ROUNDS = 10;
export const ADMIN_ROLE_CODE = 'SUPER_ADMIN';

export function getAdminCredentials() {
  return {
    email: process.env.JWT_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.JWT_ADMIN_PASSWORD || 'password',
  };
}

export async function mapAuthUserDocument(
  doc: UserDocument,
): Promise<AuthUser> {
  if (!doc._id) {
    throw new Error('Invalid user document');
  }

  const roleIds = doc.roleIds ?? [];
  const permissions = await getPermissionsByRoleIds(roleIds);

  return {
    id: doc._id.toHexString(),
    name: doc.fullName,
    email: doc.email,
    image: '/avatars/01.png',
    roleIds,
    permissions,
  };
}

export function getAllPermissions() {
  return ALL_PERMISSIONS;
}
