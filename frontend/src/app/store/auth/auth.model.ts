import { LoginResponse } from '../../core/http/auth/types/response.types';
import { LoadableState } from '../shared';

export type AuthState = LoadableState<LoginResponse>;

export const initialState: AuthState = {
  isLoading: false,
  error: null,
  data: null,
};
