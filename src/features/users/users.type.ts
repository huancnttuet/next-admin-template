export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  isVerify: boolean;
  isLock: boolean;
}

export interface GetUsersParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
  IsVerify?: boolean;
  IsLock?: boolean;
}

export interface CreateUserPayload {
  fullName: string;
  userName: string;
  email: string;
  isVerify?: boolean;
  isLock?: boolean;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;
