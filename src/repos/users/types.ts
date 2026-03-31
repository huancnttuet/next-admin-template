import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id?: ObjectId;
  fullName: string;
  userName: string;
  email: string;
  passwordHash?: string;
  roleIds?: string[];
  isVerify: boolean;
  isLock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
  isVerify?: boolean;
  isLock?: boolean;
}
