import axios from 'axios';
import type {
  CreateRolePayload,
  GetRolesParams,
  Role,
  UpdateRolePayload,
} from './roles.type';
import type { PagedList } from '@/types/api';

export const getPagedRoles = async (
  params: GetRolesParams,
): Promise<PagedList<Role>> => {
  const res = await axios.get<PagedList<Role>>('/api/roles/paged-list', {
    params,
  });
  return res.data;
};

export const getRoleById = async (id: string): Promise<Role> => {
  const res = await axios.get<Role>(`/api/roles/${id}`);
  return res.data;
};

export const createRole = async (payload: CreateRolePayload): Promise<Role> => {
  const res = await axios.post<Role>('/api/roles', payload);
  return res.data;
};

export const updateRole = async (
  id: string,
  payload: UpdateRolePayload,
): Promise<Role> => {
  const res = await axios.put<Role>(`/api/roles/${id}`, payload);
  return res.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await axios.delete(`/api/roles/${id}`);
};
