import { PaginationData } from '../../../../store/shared';

export type TeamsDataRequest = PaginationData;

export interface CreateTeamRequest {
  name: string;
  address: string;
  range: number;
  description: string;
}

export interface EditTeamRequest {
  id: string;
  name: string;
  address: string;
  range: number;
  description: string;
}

export interface DeleteTeamRequest {
  id: string;
}
