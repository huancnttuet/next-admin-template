export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  userIds: string[];
  userCount: number;
  permissions: string[];
  permissionCount: number;
}

export interface GetRolesParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  description?: string;
  userIds?: string[];
  permissions?: string[];
}

export type UpdateRolePayload = Partial<CreateRolePayload>;
