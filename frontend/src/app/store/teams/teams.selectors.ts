import { createSelector } from '@ngrx/store';

import { AppState } from '../';
import { TeamsState } from './teams.model';

export const selectTeamsState = createSelector(
  (state: AppState): TeamsState => state.teams,
  (teams) => teams
);

export const selectPaginationData = createSelector(
  selectTeamsState,
  (state) => state.paginationData
);

export const selectTeamsStateData = createSelector(selectTeamsState, (state) => state.data);

export const selectTeamsStateIsLoading = createSelector(
  selectTeamsState,
  (state) => state.isLoading
);

export const selectTeamsStateError = createSelector(selectTeamsState, (state) => state.error);

export const selectMinimalTeamsStateDate = createSelector(
  selectTeamsState,
  (state) => state.minimalTeams
);
