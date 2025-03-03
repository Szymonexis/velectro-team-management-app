import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { effects, facades, metaReducers, reducers } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    ...facades,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ ...reducers, router: routerReducer }, { metaReducers }),
    provideRouterStore(),
    provideEffects(effects),
    provideStoreDevtools({ maxAge: 50, logOnly: environment.isProduction }),
    provideAnimationsAsync(),
  ],
};
