import { UserFilterField } from '../../../../components/users/user.model';

export interface UserPaginatedArrayResponse {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  filterFields: UserFilterField[];
  sortFields: string[];
  searchFields: string[];
  users: UserResponse[];
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  isAdmin: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersArrayResponse {
  users: UserResponse[];
}
