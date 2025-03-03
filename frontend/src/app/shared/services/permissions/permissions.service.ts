import { map, Observable } from 'rxjs';

import { computed, inject, Injectable, signal } from '@angular/core';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

import { AuthFacade } from '../../../store/auth/auth.facade';
import { AuthState } from '../../../store/auth/auth.model';
import { UserPermissions } from './permissions.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService extends OnDestroyMixin {
  private readonly _authFacade = inject(AuthFacade);
  private readonly _authState$ = this._authFacade.authState$;
  private readonly _permissionsSignal = signal<UserPermissions | null>(null);

  permissions = computed(() => this._permissionsSignal());
  permissions$ = this._getPermissions$();

  constructor() {
    super();

    this._authState$
      .pipe(untilComponentDestroyed(this), map(this._mapAuthStateToPermissions.bind(this)))
      .subscribe((permissions) => {
        this._permissionsSignal.set(permissions);
      });
  }

  private _getPermissions$(): Observable<UserPermissions> {
    return this._authState$.pipe(
      untilComponentDestroyed(this),
      map(this._mapAuthStateToPermissions.bind(this))
    );
  }

  private _mapAuthStateToPermissions(state: AuthState): UserPermissions {
    return {
      isAdmin: state.data?.isAdmin ?? false,
      canUpdate: state.data?.canUpdate ?? false,
      canCreate: state.data?.canCreate ?? false,
      canDelete: state.data?.canDelete ?? false,
    };
  }
}
