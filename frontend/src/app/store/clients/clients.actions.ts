import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import {
  ClientsDataRequest,
  CreateClientRequest,
  DeleteClientRequest,
  EditClientRequest,
} from '../../core/http/clients/types/request.types';
import { ClientArrayPaginatedResponse } from '../../core/http/clients/types/response.types';
import { NotificationPayload } from '../notification/notification.model';
import { PaginationData } from '../shared';

export const getClients = createAction('[Clients] getClients', props<ClientsDataRequest>());

export const getClientsSuccess = createAction(
  '[Clients] getClientsSuccess',
  props<NotificationPayload<ClientArrayPaginatedResponse>>()
);

export const getClientsFailure = createAction(
  '[Clients] getClientsFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const createClient = createAction('[Clients] createClient', props<CreateClientRequest>());

export const createClientSuccess = createAction(
  '[Clients] createClientSuccess',
  props<NotificationPayload>()
);

export const createClientFailure = createAction(
  '[Clients] createClientFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const deleteClient = createAction('[Clients] deleteClient', props<DeleteClientRequest>());

export const deleteClientSuccess = createAction(
  '[Clients] deleteClientSuccess',
  props<NotificationPayload>()
);

export const deleteClientFailure = createAction(
  '[Clients] deleteClientFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const editClient = createAction('[Clients] editClient', props<EditClientRequest>());

export const editClientSuccess = createAction(
  '[Clients] editClientSuccess',
  props<NotificationPayload>()
);

export const editClientFailure = createAction(
  '[Clients] editClientFailure',
  props<NotificationPayload<HttpErrorResponse>>()
);

export const updatePaginationData = createAction(
  '[Clients] updatePaginationData',
  props<PaginationData>()
);
