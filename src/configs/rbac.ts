import { AppRoutes } from '@/configs/routes';

export const Permissions = {
  UsersRead: 'users.read',
  UsersWrite: 'users.write',
  RolesRead: 'roles.read',
  RolesWrite: 'roles.write',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

export const ALL_PERMISSIONS: Permission[] = [
  Permissions.UsersRead,
  Permissions.UsersWrite,
  Permissions.RolesRead,
  Permissions.RolesWrite,
];

export const PERMISSION_OPTIONS: Array<{ value: Permission; label: string }> = [
  { value: Permissions.UsersRead, label: 'Users: Read' },
  { value: Permissions.UsersWrite, label: 'Users: Write' },
  { value: Permissions.RolesRead, label: 'Roles: Read' },
  { value: Permissions.RolesWrite, label: 'Roles: Write' },
];

export const PAGE_PERMISSION_PREFIXES: Array<{
  prefix: string;
  permission: Permission;
}> = [
  { prefix: AppRoutes.Users, permission: Permissions.UsersRead },
  { prefix: AppRoutes.Roles, permission: Permissions.RolesRead },
];
