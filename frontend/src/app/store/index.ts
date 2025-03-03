import { localStorageSync } from 'ngrx-store-localstorage';

import { ActionReducer, ActionReducerMap } from '@ngrx/store';

import { AuthEffects } from './auth/auth.effects';
import { AuthFacade } from './auth/auth.facade';
import { AuthState } from './auth/auth.model';
import { authReducer } from './auth/auth.reducer';
import { ClientsEffects } from './clients/clients.effects';
import { ClientsFacade } from './clients/clients.facade';
import { ClientsState } from './clients/clients.model';
import { clientsReducer } from './clients/clients.reducer';
import { MapEffects } from './map/map.effects';
import { MapFacade } from './map/map.facade';
import { MapState } from './map/map.model';
import { mapReducer } from './map/map.reducer';
import { NotificationEffects } from './notification/notification.effects';
import { NotificationFacade } from './notification/notification.facade';
import { NotificationState } from './notification/notification.model';
import { notificationReducer } from './notification/notification.reducer';
import { TeamsEffects } from './teams/teams.effects';
import { TeamsFacade } from './teams/teams.facade';
import { TeamsState } from './teams/teams.model';
import { teamsReducer } from './teams/teams.reducer';
import { UsersEffects } from './users/users.effects';
import { UsersFacade } from './users/users.facade';
import { UsersState } from './users/users.model';
import { usersReducer } from './users/users.reducer';

export interface AppState {
  notification: NotificationState;
  auth: AuthState;
  users: UsersState;
  teams: TeamsState;
  clients: ClientsState;
  map: MapState;
}

export const effects = [
  NotificationEffects,
  AuthEffects,
  UsersEffects,
  TeamsEffects,
  ClientsEffects,
  MapEffects,
];

export const facades = [
  NotificationFacade,
  AuthFacade,
  UsersFacade,
  TeamsFacade,
  ClientsFacade,
  MapFacade,
];

export const reducers: ActionReducerMap<AppState> = {
  notification: notificationReducer,
  auth: authReducer,
  users: usersReducer,
  teams: teamsReducer,
  clients: clientsReducer,
  map: mapReducer,
};

function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: [
      {
        auth: ['data'],
      },
    ],
    rehydrate: true,
    storageKeySerializer: (key) =>
      `60A5D3E4100FE8AFA5EE0103739A45711D50D7F3BA7280D8A95B51F5D04AA4B8_${key}`,
  })(reducer);
}

export const metaReducers = [localStorageSyncReducer];
