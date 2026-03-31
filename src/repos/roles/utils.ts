import { ObjectId } from 'mongodb';
import { ALL_PERMISSIONS, type Permission } from '@/configs/rbac';

export function normalizeUserIds(userIds: string[]) {
  const unique = Array.from(new Set(userIds));
  return unique.filter((id) => ObjectId.isValid(id));
}

export function normalizePermissions(permissions: string[]): Permission[] {
  const unique = Array.from(new Set(permissions));
  return unique.filter((value): value is Permission =>
    (ALL_PERMISSIONS as string[]).includes(value),
  );
}
