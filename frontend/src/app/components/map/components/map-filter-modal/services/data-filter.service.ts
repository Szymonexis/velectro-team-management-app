import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import {
  MapClientResponse,
  MapTeamResponse,
} from '../../../../../core/http/map/types/response.types';
import { MapFacade } from '../../../../../store/map/map.facade';
import { ClientsFilters } from '../components/clients-filters/clients-filters.model';
import { TeamsFilters } from '../components/teams-filters/team-filters.model';

@Injectable({
  providedIn: 'root',
})
export class DataFilterService {
  private readonly _mapFacade = inject(MapFacade);
  private readonly _mapClientsState$ = this._mapFacade.mapClientsState$;
  private readonly _mapTeamsState$ = this._mapFacade.mapTeamsState$;

  filterClients(clientsFilters: ClientsFilters): Observable<MapClientResponse[]> {
    return this._mapClientsState$.pipe(
      map((clients) => {
        const { name, address, invoiceAcceptanceDate, invoiceEndDate, team, voivodeship } =
          clientsFilters;

        return (
          clients?.data?.filter((client) =>
            this._isClientMatching(
              client,
              name,
              address,
              invoiceAcceptanceDate,
              invoiceEndDate,
              team,
              voivodeship
            )
          ) || []
        );
      })
    );
  }

  filterTeams(teamsFilters: TeamsFilters): Observable<MapTeamResponse[]> {
    return this._mapTeamsState$.pipe(
      map((teams) => {
        const { name, address, voivodeship, rangeFrom, rangeTo } = teamsFilters;

        return (
          teams?.data?.filter((team) =>
            this._isTeamMatching(team, name, address, voivodeship, rangeFrom, rangeTo)
          ) || []
        );
      })
    );
  }

  private _isClientMatching(
    client: MapClientResponse,
    name?: string | null,
    address?: string | null,
    invoiceAcceptanceDate?: Date | null,
    invoiceEndDate?: Date | null,
    team?: string | null,
    voivodeship?: string | null
  ): boolean {
    return (
      this._isMatchingString(client.name, name) &&
      this._isMatchingString(client.address, address) &&
      this._isMatchingDate(client.invoiceAcceptanceDate, invoiceAcceptanceDate) &&
      this._isMatchingDate(client.invoiceEndDate, invoiceEndDate) &&
      this._isMatchingString(client.team, team) &&
      this._isMatchingString(client.voivodeship, voivodeship)
    );
  }

  private _isTeamMatching(
    team: MapTeamResponse,
    name?: string | null,
    address?: string | null,
    voivodeship?: string | null,
    rangeFrom?: number | null,
    rangeTo?: number | null
  ): boolean {
    return (
      this._isMatchingString(team.name, name) &&
      this._isMatchingString(team.address, address) &&
      this._isMatchingString(team.voivodeship, voivodeship) &&
      this._isMatchingRange(team.range, rangeFrom, rangeTo)
    );
  }

  private _isMatchingString(value?: string | null, query?: string | null): boolean {
    if (!query) return true;

    return value?.toLowerCase().includes(query.toLowerCase()) || false;
  }

  private _isMatchingDate(value?: Date | null, query?: Date | null): boolean {
    if (!query) return true;
    if (!value) return false;

    return new Date(value).getTime() === new Date(query).getTime();
  }

  private _isMatchingRange(
    value?: number | null,
    rangeFrom?: number | null,
    rangeTo?: number | null
  ): boolean {
    if (rangeFrom == null && rangeTo == null) return true;
    if (value == null) return false;

    return (rangeFrom == null || value >= rangeFrom) && (rangeTo == null || value <= rangeTo);
  }
}
