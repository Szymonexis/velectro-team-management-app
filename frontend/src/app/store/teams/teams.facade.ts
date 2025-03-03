import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../';
import {
  CreateTeamRequest,
  DeleteTeamRequest,
  EditTeamRequest,
  TeamsDataRequest,
} from '../../core/http/teams/types/request.types';
import { PaginationData } from '../shared';
import * as teamsActions from './teams.actions';
import * as teamsSelectors from './teams.selectors';

@Injectable()
export class TeamsFacade {
  private readonly _store = inject(Store<AppState>);

  teamsStateData$ = this._store.select(teamsSelectors.selectTeamsStateData);
  teamsStateIsLoading$ = this._store.select(teamsSelectors.selectTeamsStateIsLoading);
  teamsStateError$ = this._store.select(teamsSelectors.selectTeamsStateError);
  paginationData$ = this._store.select(teamsSelectors.selectPaginationData);
  minimalTeamsData$ = this._store.select(teamsSelectors.selectMinimalTeamsStateDate);

  getTeams(props: TeamsDataRequest): void {
    const { pageIndex = 0, pageSize = 10, sorters = [], filters = [], search = '' } = props;

    this._store.dispatch(
      teamsActions.getTeams({
        pageIndex,
        pageSize,
        sorters,
        filters,
        search,
      })
    );
  }

  getMinimalTeams(): void {
    this._store.dispatch(teamsActions.getMinimalTeams());
  }

  updatePaginationData(props: PaginationData): void {
    this._store.dispatch(teamsActions.updatePaginationData(props));
  }

  createTeam(props: CreateTeamRequest): void {
    this._store.dispatch(teamsActions.createTeam(props));
  }

  editTeam(props: EditTeamRequest): void {
    this._store.dispatch(teamsActions.editTeam(props));
  }

  deleteTeam(props: DeleteTeamRequest): void {
    this._store.dispatch(teamsActions.deleteTeam(props));
  }
}
