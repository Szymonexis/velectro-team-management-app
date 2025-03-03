import { createReducer, on } from '@ngrx/store';

import { errored, loadedWithData, loading } from '../shared';
import * as clientsActions from './clients.actions';
import { initialState } from './clients.model';

export const clientsReducer = createReducer(
  initialState,
  // -----------getClients-----------
  on(clientsActions.getClients, (state) => ({ ...state, ...loading })),
  on(clientsActions.getClientsSuccess, (state, { data }) => ({
    ...state,
    ...loadedWithData(data),
  })),
  on(clientsActions.getClientsFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------updatePaginationData-----------
  on(clientsActions.updatePaginationData, (state, { type: __, ...paginationData }) => ({
    ...state,
    paginationData,
  })),

  // -----------createClient-----------
  on(clientsActions.createClient, (state) => ({ ...state, ...loading })),
  on(clientsActions.createClientSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(clientsActions.createClientFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------deleteClient-----------
  on(clientsActions.deleteClient, (state) => ({ ...state, ...loading })),
  on(clientsActions.deleteClientSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(clientsActions.deleteClientFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  })),

  // -----------editClient-----------
  on(clientsActions.editClient, (state) => ({ ...state, ...loading })),
  on(clientsActions.editClientSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(clientsActions.editClientFailure, (state, { data: error }) => ({
    ...state,
    ...errored(error),
  }))
);
