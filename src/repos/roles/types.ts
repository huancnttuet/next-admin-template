import { ObjectId } from 'mongodb';
import type { Permission } from '@/configs/rbac';

export interface RoleDocument {
  _id?: ObjectId;
  name: string;
  code: string;
  description?: string;
  userIds: string[];
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  userIds: string[];
  userCount: number;
  permissions: Permission[];
  permissionCount: number;
}

export interface RolePagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
}
