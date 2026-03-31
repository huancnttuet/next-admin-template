import axios from 'axios';
import type {
  CreateUserPayload,
  GetUsersParams,
  UpdateUserPayload,
  User,
} from './users.type';
import { PagedList } from '@/types/api';

export const getPagedUsers = async (
  params: GetUsersParams,
): Promise<PagedList<User>> => {
  const res = await axios.get<PagedList<User>>('/api/users/paged-list', {
    params,
  });
  return res.data;
};

export const syncUsers = async (): Promise<void> => {
  await axios.post('/api/users/sync');
};

export const getUsers = async (
  params: GetUsersParams,
): Promise<PagedList<User>> => {
  const res = await axios.get<PagedList<User>>('/api/users', { params });
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get<User>(`/api/users/${id}`);
  return res.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await axios.post<User>('/api/users', payload);
  return res.data;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const res = await axios.put<User>(`/api/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`/api/users/${id}`);
};
