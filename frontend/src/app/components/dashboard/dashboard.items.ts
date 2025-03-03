import { map, Observable } from 'rxjs';

import { inject, Injector, runInInjectionContext } from '@angular/core';

import { PATHS } from '../../shared/paths';
import { AuthFacade } from '../../store/auth/auth.facade';

export type DashboardItem = {
  label: string;
  path: string;
  disabled: boolean;
};

export function getDashboardItems(injector: Injector): Observable<DashboardItem[]> {
  const { authFacade } = runInInjectionContext(injector, () => {
    const authFacade = inject(AuthFacade);

    return { authFacade };
  });

  return authFacade.authState$.pipe(
    map((state) => {
      return [
        {
          label: 'Użytkownicy',
          path: `${PATHS.DASHBOARD}/${PATHS.USERS}`,
          disabled: !state.data?.isAdmin,
        },
        {
          label: 'Zespoły',
          path: `${PATHS.DASHBOARD}/${PATHS.TEAMS}`,
          disabled: false,
        },
        {
          label: 'Klienci',
          path: `${PATHS.DASHBOARD}/${PATHS.CLIENTS}`,
          disabled: false,
        },
        {
          label: 'Mapa',
          path: `${PATHS.DASHBOARD}/${PATHS.MAP}`,
          disabled: false,
        },
      ];
    })
  );
}
