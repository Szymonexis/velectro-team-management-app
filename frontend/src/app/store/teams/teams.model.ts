import {
  MinimalTeamResponse,
  TeamArrayPaginatedResponse,
} from '../../core/http/teams/types/response.types';
import { DEFAULT_PAGINATION_DATA, LoadableState, PaginationStoreData } from '../shared';

export type MinimalTeamsState = {
  minimalTeams: LoadableState<MinimalTeamResponse[]>;
};

export type BasicTeamsState = LoadableState<TeamArrayPaginatedResponse>;

export type TeamsState = BasicTeamsState & PaginationStoreData & MinimalTeamsState;

export const initialState: TeamsState = {
  isLoading: false,
  error: null,
  data: null,
  paginationData: DEFAULT_PAGINATION_DATA,
  minimalTeams: {
    isLoading: false,
    error: null,
    data: null,
  },
};
