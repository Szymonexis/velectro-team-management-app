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

import { EditTeamRequest } from '../../../../core/http/teams/types/request.types';
import { DESCRIPTION_MAX_LENGTH } from '../../../../shared/consts';
import { EditTeamForm } from './edit-team-modal.model';

@Component({
  selector: 'app-edit-team-modal',
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
  templateUrl: './edit-team-modal.component.html',
  styleUrl: './edit-team-modal.component.scss',
})
export class EditTeamModalComponent implements OnInit {
  readonly dialogRef = inject<MatDialogRef<EditTeamModalComponent, EditTeamRequest>>(MatDialogRef);
  readonly data = inject<EditTeamRequest>(MAT_DIALOG_DATA);

  formGroup!: FormGroup<EditTeamForm>;

  DESCRIPTION_MAX_LENGTH = DESCRIPTION_MAX_LENGTH;

  get descriptionFormControlValue(): string | null {
    return (this.formGroup?.get('description') as EditTeamForm['description'])?.value ?? null;
  }

  ngOnInit(): void {
    const { name, address, range, description } = this.data;

    this.formGroup = new FormGroup<EditTeamForm>({
      name: new FormControl(name, Validators.required),
      address: new FormControl(address, Validators.required),
      range: new FormControl(range, [
        Validators.required,
        Validators.min(0),
        Validators.max(Number.MAX_SAFE_INTEGER),
      ]),
      description: new FormControl(description, [Validators.maxLength(DESCRIPTION_MAX_LENGTH)]),
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      const userDataToUpdate: EditTeamRequest = {
        name: formData?.name ?? '',
        address: formData?.address ?? '',
        range: formData?.range ?? 0,
        description: formData?.description ?? '',
        id: this.data.id,
      };

      this.dialogRef.close(userDataToUpdate);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
