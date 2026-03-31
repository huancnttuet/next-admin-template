export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string;
  roleIds: string[];
  permissions: string[];
}

export interface LoginResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
}
