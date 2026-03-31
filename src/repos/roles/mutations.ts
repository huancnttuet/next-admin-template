import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getUsersCollection } from '@/repos/users';
import { getRolesCollection } from './collection';
import { mapRoleDocument } from './mapper';
import { createRoleSchema, updateRoleSchema } from './schema';
import { normalizePermissions, normalizeUserIds } from './utils';

async function syncUsersForRole(roleId: string, nextUserIds: string[]) {
  const usersCollection = await getUsersCollection();

  const usersWithRole = await usersCollection
    .find({ roleIds: roleId }, { projection: { _id: 1 } })
    .toArray();

  const currentUserIds = usersWithRole
    .map((user) => user._id?.toHexString())
    .filter((value): value is string => Boolean(value));

  const currentSet = new Set(currentUserIds);
  const nextSet = new Set(nextUserIds);

  const toAdd = nextUserIds.filter((id) => !currentSet.has(id));
  const toRemove = currentUserIds.filter((id) => !nextSet.has(id));

  if (toAdd.length > 0) {
    await usersCollection.updateMany(
      { _id: { $in: toAdd.map((id) => new ObjectId(id)) } },
      { $addToSet: { roleIds: roleId }, $set: { updatedAt: new Date() } },
    );
  }

  if (toRemove.length > 0) {
    await usersCollection.updateMany(
      { _id: { $in: toRemove.map((id) => new ObjectId(id)) } },
      { $pull: { roleIds: roleId }, $set: { updatedAt: new Date() } },
    );
  }
}

export async function insertRole(input: z.infer<typeof createRoleSchema>) {
  const rolesCollection = await getRolesCollection();
  const userIds = normalizeUserIds(input.userIds ?? []);
  const permissions = normalizePermissions(input.permissions ?? []);
  const now = new Date();

  const result = await rolesCollection.insertOne({
    name: input.name.trim(),
    code: input.code.trim().toUpperCase(),
    description: (input.description || '').trim(),
    userIds,
    permissions,
    createdAt: now,
    updatedAt: now,
  });

  const roleId = result.insertedId.toHexString();
  await syncUsersForRole(roleId, userIds);

  const created = await rolesCollection.findOne({ _id: result.insertedId });
  if (!created) {
    throw new Error('Failed to create role');
  }

  return mapRoleDocument(created);
}

export async function updateRoleById(
  id: string,
  patch: z.infer<typeof updateRoleSchema>,
) {
  if (!ObjectId.isValid(id)) return null;

  const rolesCollection = await getRolesCollection();
  const nextPatch: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof patch.name === 'string') {
    nextPatch.name = patch.name.trim();
  }
  if (typeof patch.code === 'string') {
    nextPatch.code = patch.code.trim().toUpperCase();
  }
  if (typeof patch.description === 'string') {
    nextPatch.description = patch.description.trim();
  }
  if (Array.isArray(patch.userIds)) {
    nextPatch.userIds = normalizeUserIds(patch.userIds);
  }
  if (Array.isArray(patch.permissions)) {
    nextPatch.permissions = normalizePermissions(patch.permissions);
  }

  await rolesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: nextPatch },
  );

  const updated = await rolesCollection.findOne({ _id: new ObjectId(id) });
  if (!updated) return null;

  await syncUsersForRole(id, normalizeUserIds(updated.userIds ?? []));
  return mapRoleDocument(updated);
}

export async function deleteRoleById(id: string) {
  if (!ObjectId.isValid(id)) return false;

  const rolesCollection = await getRolesCollection();
  const usersCollection = await getUsersCollection();

  await usersCollection.updateMany(
    { roleIds: id },
    { $pull: { roleIds: id }, $set: { updatedAt: new Date() } },
  );

  const result = await rolesCollection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
