import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../';
import * as mapActions from './map.actions';
import * as mapSelectors from './map.selectors';

@Injectable()
export class MapFacade {
  private readonly _store = inject(Store<AppState>);

  mapClientsState$ = this._store.select(mapSelectors.selectMapClientsState);
  mapTeamsState$ = this._store.select(mapSelectors.selectMapTeamsState);

  getAllMapClients(): void {
    this._store.dispatch(mapActions.getAllMapClients());
  }

  getAllMapTeams(): void {
    this._store.dispatch(mapActions.getAllMapTeams());
  }

  toggleClientShowOnMap(id: string): void {
    this._store.dispatch(mapActions.toggleClientShowOnMap({ id }));
  }

  toggleTeamShowOnMap(id: string): void {
    this._store.dispatch(mapActions.toggleTeamShowOnMap({ id }));
  }
}
