import type { Role, RoleDocument } from './types';

export function mapRoleDocument(doc: RoleDocument): Role {
  if (!doc._id) {
    throw new Error('Invalid role document');
  }

  const userIds = doc.userIds ?? [];
  const permissions = doc.permissions ?? [];

  return {
    id: doc._id.toHexString(),
    name: doc.name,
    code: doc.code,
    description: doc.description || '',
    userIds,
    userCount: userIds.length,
    permissions,
    permissionCount: permissions.length,
  };
}
