import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createUser,
  deleteUser,
  getPagedUsers,
  getUserById,
  syncUsers,
  updateUser,
} from './users.api';
import type {
  CreateUserPayload,
  GetUsersParams,
  UpdateUserPayload,
} from './users.type';

export const USER_QUERY_KEY = 'users';

export const usePagedUsers = (params: GetUsersParams) =>
  useQuery({
    queryKey: [USER_QUERY_KEY, params],
    queryFn: () => getPagedUsers(params),
    placeholderData: keepPreviousData,
  });

export const useSyncUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

export const useUserById = (id: string) =>
  useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};
