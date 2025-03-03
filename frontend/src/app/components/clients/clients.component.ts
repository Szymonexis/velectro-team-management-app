import { isNil } from 'lodash-es';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

import {
  CreateClientRequest,
  DeleteClientRequest,
  EditClientRequest,
} from '../../core/http/clients/types/request.types';
import { PermissionsService } from '../../shared/services/permissions/permissions.service';
import { ClientsFacade } from '../../store/clients/clients.facade';
import { TeamsFacade } from '../../store/teams/teams.facade';
import { DISPLAYED_COLUMNS, DISPLAYED_COLUMNS_IDS, MODAL_WIDTH } from './clients.model';
import { CreateClientModalComponent } from './components/create-client-modal/create-client-modal.component';
import { DeleteClientModalComponent } from './components/delete-client-modal/delete-client-modal.component';
import { EditClientModalComponent } from './components/edit-client-modal/edit-client-modal.component';
import { ClientsService } from './services/clients.service';
import { DATE_TEMPLATE_FORMAT } from '../../shared/models/date-format.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDatepickerModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent extends OnDestroyMixin implements OnInit {
  private readonly _dialog = inject(MatDialog);
  private readonly _clientsFacade = inject(ClientsFacade);
  private readonly _clientsService = inject(ClientsService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _teamsFacade = inject(TeamsFacade);
  private readonly _permissionsService = inject(PermissionsService);

  data$ = this._clientsFacade.clientsStateData$;
  error$ = this._clientsFacade.clientsStateError$;
  isLoading$ = this._clientsFacade.clientsStateIsLoading$;
  paginationData$ = this._clientsFacade.paginationData$;
  parsedPaginationData$ = this._clientsService.getParsedPaginationData$();
  minimalTeams$ = this._teamsFacade.minimalTeamsData$;
  userPermissions$ = this._permissionsService.permissions$;

  searchValue = '';
  displayedColumns = DISPLAYED_COLUMNS;
  displayedColumnsIds = DISPLAYED_COLUMNS_IDS;
  currentSort: Sort = { active: '', direction: '' as SortDirection };
  currentPageIndex = 0;
  currentPageSize = 10;
  minimalTeamNameMap: Record<string, string> = {};
  date_format = DATE_TEMPLATE_FORMAT;

  ngOnInit(): void {
    const queryParams = this._activatedRoute.snapshot.queryParams;

    this._clientsService.updateStoreParamsFromQueryParams(queryParams);

    this.parsedPaginationData$.subscribe((parsedPaginationData) => {
      if (parsedPaginationData.sorters.length > 0) {
        this.currentSort = parsedPaginationData.sorters[0];
      }

      this.searchValue = parsedPaginationData.search;
    });

    this.minimalTeams$.pipe(untilComponentDestroyed(this)).subscribe((minimalTeams) => {
      if (!isNil(minimalTeams.data)) {
        this.minimalTeamNameMap = minimalTeams.data.reduce(
          (map, team) => {
            map[team.id] = team.name;
            return map;
          },
          {} as Record<string, string>
        );
      }
    });
  }

  submitSearch(): void {
    this._getClients();
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    this._getClients(event.pageIndex);
  }

  submitSort(sortState: Sort): void {
    this.currentSort = sortState;
    this._getClients();
  }

  onCreate(): void {
    const dialogRef = this._dialog.open<
      CreateClientModalComponent,
      CreateClientRequest,
      CreateClientRequest
    >(CreateClientModalComponent, {
      width: MODAL_WIDTH,
      data: {
        name: '',
        address: '',
        invoiceIsDone: false,
        showOnMap: true,
        invoiceAcceptanceDate: undefined,
        description: '',
        teamId: null,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._clientsFacade.createClient(result);
        }
      });
  }

  onEdit(editClientData: EditClientRequest): void {
    const dialogRef = this._dialog.open<
      EditClientModalComponent,
      EditClientRequest,
      EditClientRequest
    >(EditClientModalComponent, {
      width: MODAL_WIDTH,
      data: editClientData,
    });

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._clientsFacade.editClient(result);
        }
      });
  }

  onDelete(id: string): void {
    const dialogRef = this._dialog.open<
      DeleteClientModalComponent,
      DeleteClientRequest,
      DeleteClientRequest
    >(DeleteClientModalComponent, {
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
          this._clientsFacade.deleteClient(result);
        }
      });
  }

  getTeamNameById(teamId: string): string {
    return this.minimalTeamNameMap[teamId] ?? 'Brak';
  }

  private _getClients(pageIndex = 0): void {
    const { filters, sorters } = this._clientsService.getSortersAndFiltersForRequest(
      [],
      this.currentSort
    );

    this._clientsFacade.updatePaginationData({
      pageIndex,
      pageSize: this.currentPageSize,
      search: this.searchValue,
      sorters: sorters ? [sorters] : [],
      filters: filters,
    });
  }
}
