import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

import {
  CreateTeamRequest,
  DeleteTeamRequest,
  EditTeamRequest,
} from '../../core/http/teams/types/request.types';
import { customPaginatorIntl } from '../../shared/custom-paginator-intl.function';
import { PaginationFilterValuePipe } from '../../shared/pipes/pagination-filter-value.pipe';
import { PermissionsService } from '../../shared/services/permissions/permissions.service';
import { TeamsFacade } from '../../store/teams/teams.facade';
import { CreateTeamModalComponent } from './components/create-team-modal/create-team-modal.component';
import { DeleteTeamModalComponent } from './components/delete-team-modal/delete-team-modal.component';
import { EditTeamModalComponent } from './components/edit-team-modal/edit-team-modal.component';
import { TeamsService } from './services/teams.service';
import {
  DISPLAYED_COLUMNS,
  DISPLAYED_COLUMNS_IDS,
  INITIAL_CHECKED_FILTERS,
  MODAL_WIDTH,
  TeamFilterFieldKeys,
} from './teams.model';
import { DATE_TEMPLATE_FORMAT } from '../../shared/models/date-format.model';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatSortModule,
    MatDividerModule,
    MatSelectModule,
    PaginationFilterValuePipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: customPaginatorIntl() }],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent extends OnDestroyMixin implements OnInit {
  private readonly _dialog = inject(MatDialog);
  private readonly _teamsFacade = inject(TeamsFacade);
  private readonly _teamsService = inject(TeamsService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _permissionsService = inject(PermissionsService);

  data$ = this._teamsFacade.teamsStateData$;
  error$ = this._teamsFacade.teamsStateError$;
  isLoading$ = this._teamsFacade.teamsStateIsLoading$;
  paginationData$ = this._teamsFacade.paginationData$;
  parsedPaginationData$ = this._teamsService.getParsedPaginationData$();
  filterFields$ = this._teamsService.getFilterFields$(this.data$);
  userPermissions$ = this._permissionsService.permissions$;

  searchValue = '';
  displayedColumns = DISPLAYED_COLUMNS;
  displayedColumnsIds = DISPLAYED_COLUMNS_IDS;
  currentSort: Sort = { active: '', direction: '' as SortDirection };
  currentPageIndex = 0;
  currentPageSize = 10;
  filtersOpen = false;
  createTeamModalOpen = false;

  selectedFilters = signal(INITIAL_CHECKED_FILTERS);

  date_format = DATE_TEMPLATE_FORMAT;

  ngOnInit(): void {
    const selectedFilters = this.selectedFilters();
    const queryParams = this._activatedRoute.snapshot.queryParams;

    this._teamsService.updateStoreParamsFromQueryParams(queryParams);

    this.parsedPaginationData$.subscribe((parsedPaginationData) => {
      if (parsedPaginationData.sorters.length > 0) {
        this.currentSort = parsedPaginationData.sorters[0];
      }

      Object.keys(parsedPaginationData.filters).forEach((key) => {
        const filterKey = key as TeamFilterFieldKeys;
        const initialValue = parsedPaginationData.filters[filterKey] ?? null;

        if (filterKey in selectedFilters) {
          selectedFilters[filterKey].value = initialValue;
        }
      });

      this.searchValue = parsedPaginationData.search;
    });

    this.selectedFilters.set(selectedFilters);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    this._getTeams(event.pageIndex);
  }

  changeFilters(filterKey: TeamFilterFieldKeys, value: any): void {
    const selectedFilters = this.selectedFilters();

    selectedFilters[filterKey].value = value;
    this.selectedFilters.set(selectedFilters);
  }

  submitSearch(): void {
    this._getTeams();
  }

  submitSort(sortState: Sort): void {
    this.currentSort = sortState;
    this._getTeams();
  }

  onToggleFiltersOpen(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  onCreate(): void {
    const dialogRef = this._dialog.open<
      CreateTeamModalComponent,
      CreateTeamRequest,
      CreateTeamRequest
    >(CreateTeamModalComponent, {
      width: MODAL_WIDTH,
      data: {
        name: '',
        address: '',
        range: 0,
        description: '',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._teamsFacade.createTeam(result);
        }
      });
  }

  onEdit(data: EditTeamRequest): void {
    const dialogRef = this._dialog.open<EditTeamModalComponent, EditTeamRequest, EditTeamRequest>(
      EditTeamModalComponent,
      {
        width: MODAL_WIDTH,
        data: data,
      }
    );

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._teamsFacade.editTeam(result);
        }
      });
  }

  onDelete(id: string): void {
    const dialogRef = this._dialog.open<
      DeleteTeamModalComponent,
      DeleteTeamRequest,
      DeleteTeamRequest
    >(DeleteTeamModalComponent, {
      width: MODAL_WIDTH,
      data: {
        id,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._teamsFacade.deleteTeam(result);
        }
      });
  }

  private _getTeams(pageIndex = 0): void {
    const selectedFilters = this.selectedFilters();

    const { filters, sorters } = this._teamsService.getSortersAndFiltersForRequest(
      selectedFilters,
      this.currentSort
    );

    this._teamsFacade.updatePaginationData({
      pageIndex,
      pageSize: this.currentPageSize,
      search: this.searchValue,
      sorters: sorters ? [sorters] : [],
      filters: filters,
    });
  }
}
