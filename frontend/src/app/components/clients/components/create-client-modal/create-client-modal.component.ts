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

import { CreateClientRequest } from '../../../../core/http/clients/types/request.types';
import { DESCRIPTION_MAX_LENGTH } from '../../../../shared/consts';
import { DATE_FORMAT } from '../../../../shared/models/date-format.model';
import { TeamsFacade } from '../../../../store/teams/teams.facade';
import { CreateClientForm } from './create-client.model';

@Component({
  selector: 'app-create-client-modal',
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
  templateUrl: './create-client-modal.component.html',
  styleUrl: './create-client-modal.component.scss',
})
export class CreateClientModalComponent extends OnDestroyMixin implements OnInit {
  readonly dialogRef =
    inject<MatDialogRef<CreateClientModalComponent, CreateClientRequest>>(MatDialogRef);
  readonly data = inject<CreateClientRequest>(MAT_DIALOG_DATA);

  private readonly _teamsFacade = inject(TeamsFacade);

  minimalTeams$ = this._teamsFacade.minimalTeamsData$;

  formGroup!: FormGroup<CreateClientForm>;

  DESCRIPTION_MAX_LENGTH = DESCRIPTION_MAX_LENGTH;

  get descriptionFormControlValue(): string | null {
    return (this.formGroup?.get('description') as CreateClientForm['description'])?.value ?? null;
  }

  ngOnInit(): void {
    this._teamsFacade.getMinimalTeams();
    const { name, address, invoiceIsDone, showOnMap, invoiceAcceptanceDate, description, teamId } =
      this.data;

    this.formGroup = new FormGroup<CreateClientForm>({
      name: new FormControl(name, [Validators.required]),
      address: new FormControl(address, [Validators.required]),
      invoiceIsDone: new FormControl({
        value: invoiceIsDone,
        disabled: isNil(invoiceAcceptanceDate),
      }),
      showOnMap: new FormControl(showOnMap),
      invoiceAcceptanceDate: new FormControl(invoiceAcceptanceDate),
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      let dateFormat = new Date();
      if (this.formGroup.value.invoiceAcceptanceDate) {
        dateFormat = new Date(this.formGroup.value.invoiceAcceptanceDate);
      }
      const teamId = this.formGroup?.value?.teamId;

      const formData: CreateClientRequest = {
        name: this.formGroup?.value?.name ?? '',
        address: this.formGroup?.value?.address ?? '',
        invoiceAcceptanceDate: dateFormat,
        invoiceIsDone: this.formGroup?.value?.invoiceIsDone ?? false,
        showOnMap: this.formGroup?.value?.showOnMap ?? false,
        description: this.formGroup?.value?.description ?? '',
        teamId: !isNil(teamId) && teamId !== '' ? teamId : null,
      };

      this.dialogRef.close(formData);
    }
  }
}
