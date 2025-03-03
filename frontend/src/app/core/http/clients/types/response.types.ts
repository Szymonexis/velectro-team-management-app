import { ClientFilterField } from '../../../../components/clients/clients.model';

export interface ClientArrayPaginatedResponse {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  filterFields: ClientFilterField[];
  sortFields: string[];
  searchFields: string[];
  clients: ClientResponse[];
}

export interface ClientResponse {
  id: string;
  name: string;
  description: string;
  address: string;
  voivodeship?: string;
  invoiceAcceptanceDate: Date;
  invoiceEndDate: Date;
  invoiceIsDone: boolean;
  showOnMap: boolean;
  createdAt: Date;
  updatedAt: Date;
  teamId?: string;
  createdById: string;
  editedById: string;
}

export interface ClientArrayResponse {
  clients: ClientResponse[];
}
