import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../';
import {
  CreateClientRequest,
  DeleteClientRequest,
  EditClientRequest,
} from '../../core/http/clients/types/request.types';
import { DEFAULT_PAGINATION_DATA, PaginationData } from '../shared';
import * as clientsActions from './clients.actions';
import * as clientsSelectors from './clients.selectors';

@Injectable()
export class ClientsFacade {
  private readonly _store = inject(Store<AppState>);

  clientsStateData$ = this._store.select(clientsSelectors.selectClientsStateData);
  clientsStateIsLoading$ = this._store.select(clientsSelectors.selectClientsStateIsLoading);
  clientsStateError$ = this._store.select(clientsSelectors.selectClientsStateError);
  paginationData$ = this._store.select(clientsSelectors.selectPaginationData);

  getClients(props: PaginationData): void {
    const { pageIndex, pageSize, sorters, filters, search } = {
      ...DEFAULT_PAGINATION_DATA,
      ...props,
    };

    this._store.dispatch(
      clientsActions.getClients({
        pageIndex,
        pageSize,
        sorters,
        filters,
        search,
      })
    );
  }

  updatePaginationData(props: PaginationData): void {
    this._store.dispatch(clientsActions.updatePaginationData(props));
  }

  createClient(props: CreateClientRequest): void {
    this._store.dispatch(clientsActions.createClient(props));
  }

  editClient(props: EditClientRequest): void {
    this._store.dispatch(clientsActions.editClient(props));
  }

  deleteClient(props: DeleteClientRequest): void {
    this._store.dispatch(clientsActions.deleteClient(props));
  }
}
