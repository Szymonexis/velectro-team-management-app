import { TRAFFIC_LIGHT } from '../../../../components/map/map.model';
import { ClientResponse } from '../../clients/types/response.types';
import { TeamResponse } from '../../teams/types/response.types';

export type MapClientResponse = Pick<
  ClientResponse,
  | 'id'
  | 'name'
  | 'address'
  | 'invoiceAcceptanceDate'
  | 'invoiceEndDate'
  | 'invoiceIsDone'
  | 'voivodeship'
> & {
  team: string | null;
  showOnMap: boolean;
  trafficLight: TRAFFIC_LIGHT;
  position: {
    lat: number;
    lng: number;
  };
};

export type MapTeamResponse = Pick<
  TeamResponse,
  'id' | 'name' | 'address' | 'range' | 'voivodeship'
> & {
  showOnMap: boolean;
  position: {
    lat: number;
    lng: number;
  };
};

export interface GetAllMapTeamsResponse {
  teams: MapTeamResponse[];
}

export interface GetAllMapClientsResponse {
  clients: MapClientResponse[];
}
