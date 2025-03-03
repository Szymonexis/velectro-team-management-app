export interface LoginResponse {
  token: string;
  id: string;
  username: string;
  isAdmin: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canRead: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
