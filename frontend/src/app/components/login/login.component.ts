import { isNil } from 'lodash-es';

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { commonImports } from '../../shared/common.imports';
import { PATHS } from '../../shared/paths';
import { AuthFacade } from '../../store/auth/auth.facade';

@Component({
  imports: [
    ...commonImports,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _authFacade = inject(AuthFacade);
  private readonly _router = inject(Router);

  readonly loginFormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  authState$ = this._authFacade.authState$;

  hidePassword = true;

  constructor() {
    this.authState$.subscribe(({ data, error }) => {
      if (!isNil(data) && !isNil(data.token) && data.token !== '' && isNil(error)) {
        this._router.navigate([`/${PATHS.DASHBOARD}`]);
      }
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginFormGroup.value;

    if (isNil(username) || isNil(password) || this.loginFormGroup.invalid) {
      return;
    }

    this._authFacade.login({ username, password });
  }

  onToggleHidePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
