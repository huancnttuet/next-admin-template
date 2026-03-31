import { PAGE_PERMISSION_PREFIXES, type Permission } from '@/configs/rbac';

export function normalizePermissions(permissions: unknown): string[] {
  if (!Array.isArray(permissions)) return [];
  return Array.from(
    new Set(
      permissions.filter((value): value is string => typeof value === 'string'),
    ),
  );
}

export function hasPermission(
  permissions: unknown,
  requiredPermission: Permission,
): boolean {
  const normalized = normalizePermissions(permissions);
  return normalized.includes('*') || normalized.includes(requiredPermission);
}

export function resolvePagePermission(pathname: string): Permission | null {
  const matched = PAGE_PERMISSION_PREFIXES.filter((item) =>
    pathname.startsWith(item.prefix),
  )
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .at(0);

  return matched?.permission ?? null;
}
