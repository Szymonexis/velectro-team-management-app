import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TEAMS_DEFAULT_FILTERS, TeamsFilters, TeamsFiltersForm } from './team-filters.model';

@Component({
  selector: 'app-teams-filters',
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
  templateUrl: './teams-filters.component.html',
  styleUrl: './teams-filters.component.scss',
})
export class TeamsFiltersComponent implements OnInit {
  @Output() teamsFiltersChange = new EventEmitter<TeamsFilters>();

  formGroup!: FormGroup<TeamsFiltersForm>;

  ngOnInit(): void {
    const { name, address, voivodeship, rangeFrom, rangeTo } = TEAMS_DEFAULT_FILTERS;

    this.formGroup = new FormGroup<TeamsFiltersForm>({
      name: new FormControl(name),
      address: new FormControl(address),
      voivodeship: new FormControl(voivodeship),
      rangeFrom: new FormControl(rangeFrom),
      rangeTo: new FormControl(rangeTo),
    });

    this.formGroup.valueChanges.subscribe(() => {
      if (this.formGroup.valid) {
        this.teamsFiltersChange.emit(this.formGroup.getRawValue());
      }
    });
  }
}
