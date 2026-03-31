import { ObjectId } from 'mongodb';
import type { PagedList } from '@/types/api';
import type { Permission } from '@/configs/rbac';
import { getRolesCollection } from './collection';
import { mapRoleDocument } from './mapper';
import { normalizePermissions } from './utils';
import type { Role, RolePagedParams } from './types';

export async function findRolesPaged({
  page,
  pageSize,
  keyword,
}: RolePagedParams): Promise<PagedList<Role>> {
  const collection = await getRolesCollection();
  const filter: Record<string, unknown> = {};

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { code: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  const totalCount = await collection.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const normalizedPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (normalizedPage - 1) * pageSize;

  const docs = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  return {
    items: docs.map(mapRoleDocument),
    totalCount,
    page: normalizedPage,
    pageSize,
    totalPages,
    hasNextPage: normalizedPage < totalPages,
    hasPreviousPage: normalizedPage > 1,
  };
}

export async function findRoleById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getRolesCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? mapRoleDocument(doc) : null;
}

export async function getPermissionsByRoleIds(roleIds: string[]) {
  const validRoleIds = Array.from(
    new Set(roleIds.filter((id) => ObjectId.isValid(id))),
  );

  if (validRoleIds.length === 0) {
    return [] as Permission[];
  }

  const rolesCollection = await getRolesCollection();
  const roles = await rolesCollection
    .find(
      { _id: { $in: validRoleIds.map((id) => new ObjectId(id)) } },
      { projection: { permissions: 1 } },
    )
    .toArray();

  const permissions = roles.flatMap((role) => role.permissions ?? []);
  return normalizePermissions(permissions);
}
