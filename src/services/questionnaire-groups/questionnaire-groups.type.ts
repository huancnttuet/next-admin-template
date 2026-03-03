// ---------- API response types ----------

export interface QuestionnaireGroup {
  id: string;
  name: string;
  code: string;
  questionnaireCount: number;
}

export interface GetQuestionnaireGroupsParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
}
