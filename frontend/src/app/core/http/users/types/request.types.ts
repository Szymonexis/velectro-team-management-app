import { PaginationData } from '../../../../store/shared';

export type UsersDataRequest = PaginationData;

export interface CreateUserRequest {
  username: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  isAdmin: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canRead: boolean;
}

export interface EditUserInfoRequest {
  id: string;
  isAdmin: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canRead: boolean;
  name: string;
}

export interface EditUserCredentialsRequest {
  id: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}

export interface DeleteUserRequest {
  id: string;
}
