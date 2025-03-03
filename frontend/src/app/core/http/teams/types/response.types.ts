import { TeamFilterField } from '../../../../components/teams/teams.model';

export interface TeamArrayPaginatedResponse {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  filterFields: TeamFilterField[];
  sortFields: string[];
  searchFields: string[];
  teams: TeamResponse[];
}

export interface TeamResponse {
  id: string;
  name: string;
  address: string;
  voivodeship?: string;
  range: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  editedById: string;
}

export interface MinimalTeamResponse {
  id: string;
  name: string;
}

export interface MinimalTeamArrayResponse {
  teams: MinimalTeamResponse[];
}
