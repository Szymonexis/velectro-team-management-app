import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../';
import * as notificationActions from './notification.actions';
import { NotificationContent } from './notification.model';
import * as notificationSelectors from './notification.selectors';

@Injectable()
export class NotificationFacade {
  private readonly _store = inject(Store<AppState>);

  notificationState$ = this._store.select(notificationSelectors.selectSuccessesState);

  add(notification: NotificationContent): void {
    this._store.dispatch(notificationActions.add({ notification }));
  }

  setShowing(showing: boolean): void {
    this._store.dispatch(notificationActions.setShowing({ showing }));
  }

  removeAt(index: number): void {
    this._store.dispatch(notificationActions.removeAt({ index }));
  }

  clearAll(): void {
    this._store.dispatch(notificationActions.clearAll());
  }
}
