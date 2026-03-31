import { hash } from 'bcryptjs';
import type { z } from 'zod';
import {
  getAllPermissions,
  getAdminCredentials,
  mapAuthUserDocument,
  ADMIN_ROLE_CODE,
  PASSWORD_SALT_ROUNDS,
} from './utils';
import { getUsersCollection } from '@/repos/users';
import { getRolesCollection } from '@/repos/roles';
import type { AuthUser } from './types';
import { registerPayloadSchema } from './schema';

export async function registerAuthUser(
  input: z.infer<typeof registerPayloadSchema>,
): Promise<AuthUser> {
  const collection = await getUsersCollection();
  const normalizedEmail = input.email.trim().toLowerCase();
  const existed = await collection.findOne({ email: normalizedEmail });
  if (existed) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const fullName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
  const passwordHash = await hash(input.password, PASSWORD_SALT_ROUNDS);
  const now = new Date();

  const result = await collection.insertOne({
    fullName,
    userName: normalizedEmail.split('@')[0],
    email: normalizedEmail,
    passwordHash,
    roleIds: [],
    isVerify: true,
    isLock: false,
    createdAt: now,
    updatedAt: now,
  });

  const inserted = await collection.findOne({ _id: result.insertedId });
  if (!inserted) {
    throw new Error('REGISTER_FAILED');
  }

  return await mapAuthUserDocument(inserted);
}

export async function ensureAdminAccount() {
  const usersCollection = await getUsersCollection();
  const rolesCollection = await getRolesCollection();
  const now = new Date();
  const adminCredentials = getAdminCredentials();
  const normalizedEmail = adminCredentials.email.trim().toLowerCase();
  const passwordHash = await hash(
    adminCredentials.password,
    PASSWORD_SALT_ROUNDS,
  );

  await rolesCollection.updateOne(
    { code: ADMIN_ROLE_CODE },
    {
      $set: {
        name: 'Super Admin',
        description: 'System administrator with all permissions',
        permissions: getAllPermissions(),
        updatedAt: now,
      },
      $setOnInsert: {
        code: ADMIN_ROLE_CODE,
        userIds: [],
        createdAt: now,
      },
    },
    { upsert: true },
  );

  const role = await rolesCollection.findOne({ code: ADMIN_ROLE_CODE });
  if (!role?._id) {
    throw new Error('SEED_ADMIN_ROLE_FAILED');
  }

  const roleId = role._id.toHexString();

  await usersCollection.updateOne(
    { email: normalizedEmail },
    {
      $set: {
        fullName: 'Admin User',
        userName: 'admin',
        passwordHash,
        isVerify: true,
        isLock: false,
        updatedAt: now,
      },
      $setOnInsert: {
        email: normalizedEmail,
        createdAt: now,
      },
    },
    { upsert: true },
  );

  await usersCollection.updateOne(
    { email: normalizedEmail },
    {
      $addToSet: {
        roleIds: roleId,
      },
      $set: {
        updatedAt: new Date(),
      },
    },
  );

  const adminUser = await usersCollection.findOne({ email: normalizedEmail });
  if (!adminUser?._id) {
    throw new Error('SEED_ADMIN_USER_FAILED');
  }

  const adminUserId = adminUser._id.toHexString();

  await rolesCollection.updateOne(
    { _id: role._id },
    {
      $addToSet: { userIds: adminUserId },
      $set: { updatedAt: new Date() },
    },
  );

  return {
    email: normalizedEmail,
    password: adminCredentials.password,
    roleCode: ADMIN_ROLE_CODE,
  };
}
