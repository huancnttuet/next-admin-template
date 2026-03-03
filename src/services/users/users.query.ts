import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getPagedUsers, syncUsers } from './users.api';
import type { GetUsersParams } from './users.type';

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
