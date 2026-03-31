export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface GetCategoriesParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
  IsActive?: boolean;
}

export interface CreateCategoryPayload {
  slug: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateCategoryPayload = Omit<
  Partial<CreateCategoryPayload>,
  'slug'
>;
