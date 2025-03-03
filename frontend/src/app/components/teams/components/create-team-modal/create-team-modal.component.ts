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

import { CreateTeamRequest } from '../../../../core/http/teams/types/request.types';
import { DESCRIPTION_MAX_LENGTH } from '../../../../shared/consts';
import { CreateTeamForm } from './create-team.model';

@Component({
  selector: 'app-create-team-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './create-team-modal.component.html',
  styleUrl: './create-team-modal.component.scss',
})
export class CreateTeamModalComponent implements OnInit {
  readonly dialogRef =
    inject<MatDialogRef<CreateTeamModalComponent, CreateTeamRequest>>(MatDialogRef);
  readonly data = inject<CreateTeamRequest>(MAT_DIALOG_DATA);

  formGroup!: FormGroup<CreateTeamForm>;

  DESCRIPTION_MAX_LENGTH = DESCRIPTION_MAX_LENGTH;

  get descriptionFormControlValue(): string | null {
    return (this.formGroup?.get('description') as CreateTeamForm['description'])?.value ?? null;
  }

  ngOnInit(): void {
    const { name, address, range, description } = this.data;

    this.formGroup = new FormGroup<CreateTeamForm>({
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formData: CreateTeamRequest = {
        name: this.formGroup.value.name ?? '',
        address: this.formGroup.value.address ?? '',
        range: this.formGroup.value.range ?? 0,
        description: this.formGroup.value.description ?? '',
      };

      this.dialogRef.close(formData);
    }
  }
}
