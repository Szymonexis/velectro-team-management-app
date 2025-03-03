import { isNil } from 'lodash-es';
import { skipWhile } from 'rxjs';

import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

import { environment } from '../environments/environment';
import { AuthFacade } from './store/auth/auth.facade';
import { NotificationFacade } from './store/notification/notification.facade';
import { NOTIFICATION_CONFIGS_MAP } from './store/notification/notification.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends OnDestroyMixin implements OnInit {
  private readonly _nofiticationFacade = inject(NotificationFacade);
  private readonly _authFacade = inject(AuthFacade);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _titleService = inject(Title);

  private readonly _notificationState$ = this._nofiticationFacade.notificationState$;

  ngOnInit(): void {
    this._titleService.setTitle(environment.appName);

    this._authFacade.refreshToken();

    this._setupNotoficationsWatcher();
  }

  private _setupNotoficationsWatcher(): void {
    this._notificationState$
      .pipe(
        untilComponentDestroyed(this),
        skipWhile(({ showing }) => showing)
      )
      .subscribe(({ notifications }) => {
        const notificationIndex = notifications.length - 1;
        const notification = notifications[notificationIndex];

        if (isNil(notification)) {
          return;
        }

        const snackBarRef = this._snackBar.open(notification.message, 'Zamknij', {
          duration: NOTIFICATION_CONFIGS_MAP[notification.type].duration,
          panelClass: [NOTIFICATION_CONFIGS_MAP[notification.type].panelClass],
          verticalPosition: 'bottom',
          horizontalPosition: 'start',
        });

        snackBarRef
          .afterOpened()
          .pipe(untilComponentDestroyed(this))
          .subscribe(() => {
            this._nofiticationFacade.setShowing(true);
          });

        snackBarRef
          .afterDismissed()
          .pipe(untilComponentDestroyed(this))
          .subscribe(() => {
            this._nofiticationFacade.removeAt(notificationIndex);
            this._nofiticationFacade.setShowing(false);
          });
      });
  }
}
