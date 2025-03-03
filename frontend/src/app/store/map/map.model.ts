import {
  GetAllMapClientsResponse,
  GetAllMapTeamsResponse,
} from '../../core/http/map/types/response.types';
import { LoadableState } from '../shared';

export type MapState = {
  teams: LoadableState<GetAllMapTeamsResponse['teams']>;
  clients: LoadableState<GetAllMapClientsResponse['clients']>;
};

export const initialState: MapState = {
  teams: {
    isLoading: false,
    error: null,
    data: null,
  },
  clients: {
    isLoading: false,
    error: null,
    data: null,
  },
};
