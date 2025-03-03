import { isNil } from 'lodash-es';
import { map, Observable, take } from 'rxjs';

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { PATHS } from '../../shared/paths';
import { AuthFacade } from '../../store/auth/auth.facade';

export const canActivateUsers: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  return authFacade.authState$.pipe(
    take(1),
    map(({ data }) => {
      if (isNil(data)) {
        return router.createUrlTree(['/', `${PATHS.LOGIN}`]);
      }

      if (!data.isAdmin) {
        return router.createUrlTree(['/', `${PATHS.DASHBOARD}`, `${PATHS.TEAMS}`]);
      }

      return true;
    })
  );
};
