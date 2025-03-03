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

import { EditUserCredentialsRequest } from '../../../../../core/http/users/types/request.types';
import { passwordComplexityValidator } from '../../../validators/password-complexity.validator';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { EditCredentialsForm } from './edit-credentials-modal.model';

@Component({
  selector: 'app-edit-credentials-modal',
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
  templateUrl: './edit-credentials-modal.component.html',
  styleUrl: './edit-credentials-modal.component.scss',
})
export class EditCredentialsModalComponent implements OnInit {
  readonly dialogRef =
    inject<MatDialogRef<EditCredentialsModalComponent, EditUserCredentialsRequest>>(MatDialogRef);
  readonly data = inject<EditUserCredentialsRequest>(MAT_DIALOG_DATA);

  formGroup!: FormGroup<EditCredentialsForm>;
  hidePassword = true;

  ngOnInit(): void {
    const { username, password, passwordConfirmation } = this.data;

    this.formGroup = new FormGroup<EditCredentialsForm>(
      {
        username: new FormControl(username, Validators.required),
        password: new FormControl(password, [Validators.required, passwordComplexityValidator]),
        passwordConfirmation: new FormControl(passwordConfirmation, Validators.required),
      },
      { validators: passwordMatchValidator('password', 'passwordConfirmation') }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      const userDataToUpdate: EditUserCredentialsRequest = {
        username: formData?.username ?? '',
        password: formData?.password ?? '',
        passwordConfirmation: formData?.passwordConfirmation ?? '',
        id: this.data.id,
      };

      this.dialogRef.close(userDataToUpdate);
    }
  }

  onToggleHidePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
