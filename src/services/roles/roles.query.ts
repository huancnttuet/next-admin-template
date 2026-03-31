import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createRole,
  deleteRole,
  getPagedRoles,
  getRoleById,
  updateRole,
} from './roles.api';
import type {
  CreateRolePayload,
  GetRolesParams,
  UpdateRolePayload,
} from './roles.type';

export const ROLE_QUERY_KEY = 'roles';

export const usePagedRoles = (params: GetRolesParams) =>
  useQuery({
    queryKey: [ROLE_QUERY_KEY, params],
    queryFn: () => getPagedRoles(params),
    placeholderData: keepPreviousData,
  });

export const useRoleById = (id: string) =>
  useQuery({
    queryKey: [ROLE_QUERY_KEY, id],
    queryFn: () => getRoleById(id),
    enabled: Boolean(id),
  });

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      updateRole(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ROLE_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROLE_QUERY_KEY] });
    },
  });
};
