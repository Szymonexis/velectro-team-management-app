import { inject, Injectable } from '@angular/core';
import { MapFacade } from '../../store/map/map.facade';
import { combineLatest, map, Observable } from 'rxjs';
import { MarkerOptions } from './map.model';
import { pick } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly _mapFacade = inject(MapFacade);
  private readonly _clientsOnMap = this._mapFacade.mapClientsState$;
  private readonly _teamsOnMap = this._mapFacade.mapTeamsState$;

  markers$ = this._getMarkers();

  private _getMarkers(): Observable<MarkerOptions[]> {
    return combineLatest([this._clientsOnMap, this._teamsOnMap]).pipe(
      map(([clientsData, teamsData]) => {
        const clientMarkers: MarkerOptions[] =
          clientsData.data
            ?.filter((client) => client.showOnMap)
            .map((client) => {
              const clientFields = pick(client, ['id', 'name', 'position']);

              const clientColor = client.trafficLight.toLowerCase();

              return {
                ...clientFields,
                markerIconUrl: `https://maps.google.com/mapfiles/ms/icons/${clientColor}-dot.png`,
                client: client,
              };
            }) ?? [];

        const teamMarkers: MarkerOptions[] =
          teamsData.data
            ?.filter((team) => team.showOnMap)
            .map((team) => {
              const teamFields = pick(team, ['id', 'name', 'position']);
              const circleOptions = {
                center: team.position,
                radius: team.range * 1000,
                strokeColor: 'blue',
                strokeOpacity: 0.3,
                strokeWeight: 1,
                fillColor: 'blue',
                fillOpacity: 0.3,
              };
              return {
                ...teamFields,
                markerIconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                circleOptions,
                team: team,
              };
            }) ?? [];

        return [...clientMarkers, ...teamMarkers];
      })
    );
  }
}
