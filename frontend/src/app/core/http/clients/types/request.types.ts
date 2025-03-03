import { PaginationData } from '../../../../store/shared';

export type ClientsDataRequest = PaginationData;

export interface CreateClientRequest {
  name: string;
  address: string;
  invoiceIsDone: boolean;
  showOnMap: boolean;
  invoiceAcceptanceDate?: Date;
  description: string;
  teamId: string | null;
}

export interface EditClientRequest {
  id: string;
  name: string;
  address: string;
  invoiceIsDone: boolean;
  showOnMap: boolean;
  description: string;
  invoiceAcceptanceDate?: Date;
  teamId: string | null;
}

export interface DeleteClientRequest {
  id: string;
}
