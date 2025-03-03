import { isNil } from 'lodash-es';
import { switchMap, take } from 'rxjs';

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthFacade } from '../../store/auth/auth.facade';

const URLS_TO_NOT_INTERCEPT = ['/auth/login'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);

  const urlsToNotIntercept = URLS_TO_NOT_INTERCEPT;

  return authFacade.authState$.pipe(
    take(1),
    switchMap(({ data }) => {
      const shouldNotIntercept = urlsToNotIntercept.some((url) => req.url.includes(url));

      if (isNil(data) || shouldNotIntercept) {
        return next(req);
      }

      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      return next(clonedReq);
    })
  );
};
