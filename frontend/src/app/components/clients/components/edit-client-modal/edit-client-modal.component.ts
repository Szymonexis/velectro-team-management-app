import { isNil } from 'lodash-es';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

import { EditClientRequest } from '../../../../core/http/clients/types/request.types';
import { DESCRIPTION_MAX_LENGTH } from '../../../../shared/consts';
import { DATE_FORMAT } from '../../../../shared/models/date-format.model';
import { TeamsFacade } from '../../../../store/teams/teams.facade';
import { EditClientForm } from './edit-client.model';

@Component({
  selector: 'app-edit-client-modal',
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
    MatDatepickerModule,
    MatNativeDateModule,
    NgSelectComponent,
    NgSelectModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ],
  templateUrl: './edit-client-modal.component.html',
  styleUrl: './edit-client-modal.component.scss',
})
export class EditClientModalComponent extends OnDestroyMixin implements OnInit {
  readonly dialogRef =
    inject<MatDialogRef<EditClientModalComponent, EditClientRequest>>(MatDialogRef);
  readonly data = inject<EditClientRequest>(MAT_DIALOG_DATA);

  private readonly _teamsFacade = inject(TeamsFacade);

  minimalTeams$ = this._teamsFacade.minimalTeamsData$;

  formGroup!: FormGroup<EditClientForm>;

  DESCRIPTION_MAX_LENGTH = DESCRIPTION_MAX_LENGTH;

  get descriptionFormControlValue(): string | null {
    return (this.formGroup?.get('description') as EditClientForm['description'])?.value ?? null;
  }

  ngOnInit(): void {
    this._teamsFacade.getMinimalTeams();
    const { name, address, invoiceIsDone, showOnMap, invoiceAcceptanceDate, description, teamId } =
      this.data;

    this.formGroup = new FormGroup<EditClientForm>({
      name: new FormControl(name, Validators.required),
      address: new FormControl(address, Validators.required),
      invoiceIsDone: new FormControl({
        value: invoiceIsDone,
        disabled: isNil(invoiceAcceptanceDate),
      }),
      showOnMap: new FormControl(showOnMap),
      invoiceAcceptanceDate: new FormControl(
        isNil(invoiceAcceptanceDate) ? invoiceAcceptanceDate : new Date(invoiceAcceptanceDate)
      ),
      description: new FormControl(description, [Validators.maxLength(DESCRIPTION_MAX_LENGTH)]),
      teamId: new FormControl(teamId),
    });

    this.formGroup
      ?.get('invoiceAcceptanceDate')
      ?.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.formGroup?.get('invoiceIsDone')?.enable();
        } else {
          this.formGroup?.get('invoiceIsDone')?.setValue(false);
          this.formGroup?.get('invoiceIsDone')?.disable();
        }
      });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const teamId = this.formGroup?.value?.teamId;

      const formData: EditClientRequest = {
        id: this.data.id,
        name: this.formGroup?.value?.name ?? '',
        address: this.formGroup?.value?.address ?? '',
        invoiceAcceptanceDate: this.formGroup?.value?.invoiceAcceptanceDate ?? new Date(),
        invoiceIsDone: this.formGroup?.value?.invoiceIsDone ?? false,
        showOnMap: this.formGroup?.value?.showOnMap ?? false,
        description: this.formGroup?.value?.description ?? '',
        teamId: !isNil(teamId) && teamId !== '' ? teamId : null,
      };

      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
