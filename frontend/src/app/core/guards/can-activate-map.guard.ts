import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { MapFacade } from '../../store/map/map.facade';

export const canActivateMap: CanActivateFn = () => {
  const mapFacade = inject(MapFacade);

  mapFacade.getAllMapClients();
  mapFacade.getAllMapTeams();

  return true;
};
