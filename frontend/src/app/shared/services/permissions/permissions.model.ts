import { LoginResponse } from '../../../core/http/auth/types/response.types';

export type UserPermissions = Pick<
  LoginResponse,
  'isAdmin' | 'canUpdate' | 'canCreate' | 'canDelete'
>;
