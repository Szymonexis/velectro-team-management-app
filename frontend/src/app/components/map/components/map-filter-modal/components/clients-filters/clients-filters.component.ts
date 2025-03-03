import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { DATE_FORMAT } from '../../../../../../shared/models/date-format.model';
import {
  CLIENTS_DEFAULT_FILTERS,
  ClientsFilters,
  ClientsFiltersForm,
} from './clients-filters.model';

@Component({
  selector: 'app-clients-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ],
  templateUrl: './clients-filters.component.html',
  styleUrl: './clients-filters.component.scss',
})
export class ClientsFiltersComponent implements OnInit {
  @Output() clientsFiltersChange = new EventEmitter<ClientsFilters>();

  formGroup!: FormGroup<ClientsFiltersForm>;

  ngOnInit(): void {
    const {
      name,
      address,
      invoiceAcceptanceDate,
      invoiceEndDate,
      invoiceIsDone,
      team,
      voivodeship,
    } = CLIENTS_DEFAULT_FILTERS;

    this.formGroup = new FormGroup<ClientsFiltersForm>({
      name: new FormControl(name),
      address: new FormControl(address),
      invoiceAcceptanceDate: new FormControl(invoiceAcceptanceDate),
      invoiceEndDate: new FormControl(invoiceEndDate),
      invoiceIsDone: new FormControl(invoiceIsDone),
      team: new FormControl(team),
      voivodeship: new FormControl(voivodeship),
    });

    this.formGroup.valueChanges.subscribe(() => {
      if (this.formGroup.valid) {
        this.clientsFiltersChange.emit(this.formGroup.getRawValue());
      }
    });
  }
}
