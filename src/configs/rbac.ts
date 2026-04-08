import { AppRoutes } from '@/configs/routes';

export const Permissions = {
  UsersRead: 'users.read',
  UsersWrite: 'users.write',
  RolesRead: 'roles.read',
  RolesWrite: 'roles.write',
  CategoriesRead: 'categories.read',
  CategoriesWrite: 'categories.write',
  ProductsRead: 'products.read',
  ProductsWrite: 'products.write',
  OrdersRead: 'orders.read',
  OrdersWrite: 'orders.write',
  PromocodesRead: 'promocodes.read',
  PromocodesWrite: 'promocodes.write',
  ReviewsRead: 'reviews.read',
  ReviewsWrite: 'reviews.write',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

export const ALL_PERMISSIONS: Permission[] = [
  Permissions.UsersRead,
  Permissions.UsersWrite,
  Permissions.RolesRead,
  Permissions.RolesWrite,
  Permissions.CategoriesRead,
  Permissions.CategoriesWrite,
  Permissions.ProductsRead,
  Permissions.ProductsWrite,
  Permissions.OrdersRead,
  Permissions.OrdersWrite,
  Permissions.PromocodesRead,
  Permissions.PromocodesWrite,
  Permissions.ReviewsRead,
  Permissions.ReviewsWrite,
];

export const PERMISSION_OPTIONS: Array<{ value: Permission; label: string }> = [
  { value: Permissions.UsersRead, label: 'Users: Read' },
  { value: Permissions.UsersWrite, label: 'Users: Write' },
  { value: Permissions.RolesRead, label: 'Roles: Read' },
  { value: Permissions.RolesWrite, label: 'Roles: Write' },
  { value: Permissions.CategoriesRead, label: 'Categories: Read' },
  { value: Permissions.CategoriesWrite, label: 'Categories: Write' },
  { value: Permissions.ProductsRead, label: 'Products: Read' },
  { value: Permissions.ProductsWrite, label: 'Products: Write' },
  { value: Permissions.OrdersRead, label: 'Orders: Read' },
  { value: Permissions.OrdersWrite, label: 'Orders: Write' },
  { value: Permissions.PromocodesRead, label: 'Promocodes: Read' },
  { value: Permissions.PromocodesWrite, label: 'Promocodes: Write' },
  { value: Permissions.ReviewsRead, label: 'Reviews: Read' },
  { value: Permissions.ReviewsWrite, label: 'Reviews: Write' },
];

export const PAGE_PERMISSION_PREFIXES: Array<{
  prefix: string;
  permission: Permission;
}> = [
  { prefix: AppRoutes.Users, permission: Permissions.UsersRead },
  { prefix: AppRoutes.Roles, permission: Permissions.RolesRead },
  { prefix: AppRoutes.Categories, permission: Permissions.CategoriesRead },
  { prefix: AppRoutes.Products, permission: Permissions.ProductsRead },
  { prefix: AppRoutes.Orders, permission: Permissions.OrdersRead },
  { prefix: AppRoutes.Promocodes, permission: Permissions.PromocodesRead },
  { prefix: AppRoutes.Reviews, permission: Permissions.ReviewsRead },
];
