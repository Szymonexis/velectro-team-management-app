import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { CreateUserRequest } from '../../../../core/http/users/types/request.types';
import { passwordComplexityValidator } from '../../validators/password-complexity.validator';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { CreateUserForm, DISPLAYED_PERMISSIONS_FIELDS } from './create-user-modal.model';

@Component({
  selector: 'app-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  templateUrl: './create-user-modal.component.html',
  styleUrl: './create-user-modal.component.scss',
})
export class CreateUserModalComponent implements OnInit {
  readonly dialogRef =
    inject<MatDialogRef<CreateUserModalComponent, CreateUserRequest>>(MatDialogRef);
  readonly data = inject<CreateUserRequest>(MAT_DIALOG_DATA);

  hidePassword = true;
  displayedPermissions = DISPLAYED_PERMISSIONS_FIELDS;

  formGroup!: FormGroup<CreateUserForm>;

  ngOnInit(): void {
    const {
      username,
      name,
      password,
      passwordConfirmation,
      isAdmin,
      canCreate,
      canDelete,
      canRead,
      canUpdate,
    } = this.data;

    this.formGroup = new FormGroup<CreateUserForm>(
      {
        username: new FormControl(username, Validators.required),
        name: new FormControl(name, Validators.required),
        password: new FormControl(password, [Validators.required, passwordComplexityValidator]),
        passwordConfirmation: new FormControl(passwordConfirmation, Validators.required),
        isAdmin: new FormControl(isAdmin, Validators.required),
        canCreate: new FormControl(canCreate, Validators.required),
        canDelete: new FormControl(canDelete, Validators.required),
        canRead: new FormControl(canRead, Validators.required),
        canUpdate: new FormControl(canUpdate, Validators.required),
      },
      { validators: passwordMatchValidator('password', 'passwordConfirmation') }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData: CreateUserRequest = {
        username: this.formGroup.value.username ?? '',
        name: this.formGroup.value.name ?? '',
        password: this.formGroup.value.password ?? '',
        passwordConfirmation: this.formGroup.value.passwordConfirmation ?? '',
        isAdmin: this.formGroup.value.isAdmin ?? false,
        canCreate: this.formGroup.value.canCreate ?? false,
        canDelete: this.formGroup.value.canDelete ?? false,
        canRead: this.formGroup.value.canRead ?? false,
        canUpdate: this.formGroup.value.canUpdate ?? false,
      };

      this.dialogRef.close(formData);
    }
  }

  onToggleHidePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
