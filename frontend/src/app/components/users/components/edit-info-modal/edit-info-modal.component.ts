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

import { EditUserInfoRequest } from '../../../../core/http/users/types/request.types';
import { EditInfoForm } from './edit-info-modal.model';

@Component({
  selector: 'app-edit-info-modal',
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
  templateUrl: './edit-info-modal.component.html',
  styleUrl: './edit-info-modal.component.scss',
})
export class EditInfoModalComponent implements OnInit {
  readonly dialogRef =
    inject<MatDialogRef<EditInfoModalComponent, EditUserInfoRequest>>(MatDialogRef);
  readonly data = inject<EditUserInfoRequest>(MAT_DIALOG_DATA);

  formGroup!: FormGroup<EditInfoForm>;

  ngOnInit(): void {
    const { id, name, isAdmin, canCreate, canDelete, canRead, canUpdate } = this.data;

    this.formGroup = new FormGroup<EditInfoForm>({
      id: new FormControl(id, Validators.required),
      name: new FormControl(name, Validators.required),
      isAdmin: new FormControl(isAdmin, Validators.required),
      canCreate: new FormControl(canCreate, Validators.required),
      canDelete: new FormControl(canDelete, Validators.required),
      canRead: new FormControl(canRead, Validators.required),
      canUpdate: new FormControl(canUpdate, Validators.required),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData: EditUserInfoRequest = {
        id: this.formGroup.value.id ?? '', // Fallback to an empty string if null
        name: this.formGroup.value.name ?? '',
        isAdmin: this.formGroup.value.isAdmin ?? false,
        canCreate: this.formGroup.value.canCreate ?? false,
        canDelete: this.formGroup.value.canDelete ?? false,
        canRead: this.formGroup.value.canRead ?? false,
        canUpdate: this.formGroup.value.canUpdate ?? false,
      };

      this.dialogRef.close(formData);
    }
  }
}
