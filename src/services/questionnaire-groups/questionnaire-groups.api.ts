import proxyClient from '@/lib/apis/proxy-client';
import type {
  CreateQuestionnaireGroupRequest,
  GetQuestionnaireGroupsParams,
  QuestionnaireGroup,
} from './questionnaire-groups.type';
import { PagedList } from '@/types/api';

export const getPagedQuestionnaireGroups = async (
  params: GetQuestionnaireGroupsParams,
): Promise<PagedList<QuestionnaireGroup>> => {
  const res = await proxyClient.get<PagedList<QuestionnaireGroup>>(
    '/questionnaire-groups/paged-list',
    { params },
  );
  return res.data;
};

export const getQuestionnaireGroupDetail = async (
  id: string,
): Promise<QuestionnaireGroup> => {
  const res = await proxyClient.get<QuestionnaireGroup>(
    `/questionnaire-groups/${id}`,
  );
  return res.data;
};

export const createQuestionnaireGroup = async (
  data: CreateQuestionnaireGroupRequest,
): Promise<QuestionnaireGroup> => {
  const res = await proxyClient.post<QuestionnaireGroup>(
    '/questionnaire-groups',
    data,
  );
  return res.data;
};
