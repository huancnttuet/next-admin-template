import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createQuestionnaireGroup,
  getPagedQuestionnaireGroups,
  getQuestionnaireGroupDetail,
} from './questionnaire-groups.api';
import type {
  CreateQuestionnaireGroupRequest,
  GetQuestionnaireGroupsParams,
} from './questionnaire-groups.type';

export const QUESTIONNAIRE_GROUP_QUERY_KEY = 'questionnaire-groups';

export const usePagedQuestionnaireGroups = (
  params: GetQuestionnaireGroupsParams,
) =>
  useQuery({
    queryKey: [QUESTIONNAIRE_GROUP_QUERY_KEY, params],
    queryFn: () => getPagedQuestionnaireGroups(params),
    placeholderData: keepPreviousData,
  });

export const useQuestionnaireGroupDetail = (id: string) =>
  useQuery({
    queryKey: [QUESTIONNAIRE_GROUP_QUERY_KEY, id],
    queryFn: () => getQuestionnaireGroupDetail(id),
    enabled: !!id,
  });

export const useCreateQuestionnaireGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuestionnaireGroupRequest) =>
      createQuestionnaireGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUESTIONNAIRE_GROUP_QUERY_KEY],
      });
    },
  });
};
