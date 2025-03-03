import { createSelector } from '@ngrx/store';

import { AppState } from '../';
import { MapState } from './map.model';

const selectMapState = (state: AppState): MapState => state.map;

export const selectMapClientsState = createSelector(selectMapState, (state) => state.clients);

export const selectMapTeamsState = createSelector(selectMapState, (state) => state.teams);
