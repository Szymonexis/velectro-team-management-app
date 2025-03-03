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
  CreateUserRequest,
  DeleteUserRequest,
  EditUserCredentialsRequest,
  EditUserInfoRequest,
} from '../../core/http/users/types/request.types';
import { customPaginatorIntl } from '../../shared/custom-paginator-intl.function';
import { PaginationFilterValuePipe } from '../../shared/pipes/pagination-filter-value.pipe';
import { PermissionsService } from '../../shared/services/permissions/permissions.service';
import { UsersFacade } from '../../store/users/users.facade';
import { CreateUserModalComponent } from './components/create-modal/create-user-modal.component';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { EditCredentialsModalComponent } from './components/edit-credentials-modal/edit-credentials-modal/edit-credentials-modal.component';
import { EditInfoModalComponent } from './components/edit-info-modal/edit-info-modal.component';
import { UsersService } from './services/users.service';
import {
  DISPLAYED_COLUMNS,
  DISPLAYED_COLUMNS_IDS,
  INITIAL_CHECKED_FILTERS,
  MODAL_WIDTH,
  UserFilterFieldKeys,
} from './user.model';
import { DATE_TEMPLATE_FORMAT } from '../../shared/models/date-format.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent extends OnDestroyMixin implements OnInit {
  readonly panelOpenState = signal(false);

  private readonly _dialog = inject(MatDialog);
  private readonly _usersFacade = inject(UsersFacade);
  private readonly _usersService = inject(UsersService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _permissionsService = inject(PermissionsService);

  data$ = this._usersFacade.usersStateData$;
  error$ = this._usersFacade.usersStateError$;
  isLoading$ = this._usersFacade.usersStateIsLoading$;
  paginationData$ = this._usersFacade.paginationData$;
  parsedPaginationData$ = this._usersService.getParsedPaginationData$();
  filterFields$ = this._usersService.getFilterFields$(this.data$);
  userPermissions$ = this._permissionsService.permissions$;

  searchValue = '';
  displayedColumns = DISPLAYED_COLUMNS;
  displayedColumnsIds = DISPLAYED_COLUMNS_IDS;
  currentSort: Sort = { active: '', direction: '' as SortDirection };
  currentPageIndex = 0;
  currentPageSize = 10;
  filtersOpen = false;
  createUserModalOpen = false;

  selectedFilters = signal(INITIAL_CHECKED_FILTERS);

  date_format = DATE_TEMPLATE_FORMAT;

  ngOnInit(): void {
    const queryParams = this._activatedRoute.snapshot.queryParams;
    const selectedFilters = this.selectedFilters();

    this._usersService.updateStoreParamsFromQueryParams(queryParams);

    this.parsedPaginationData$.subscribe((parsedPaginationData) => {
      if (parsedPaginationData.sorters.length > 0) {
        this.currentSort = parsedPaginationData.sorters[0];
      }

      Object.keys(parsedPaginationData.filters).forEach((key) => {
        const filterKey = key as UserFilterFieldKeys;
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
    this._getUsers(event.pageIndex);
  }

  changeFilters(filterKey: UserFilterFieldKeys, value: any): void {
    const selectedFilters = this.selectedFilters();

    selectedFilters[filterKey].value = value;
    this.selectedFilters.set(selectedFilters);
  }

  submitSearch(): void {
    this._getUsers();
  }

  onClose(): void {
    this.searchValue = '';
  }

  submitSort(sortState: Sort): void {
    this.currentSort = sortState;
    this._getUsers();
  }

  onToggleFiltersOpen(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  onCreate(): void {
    const dialogRef = this._dialog.open<
      CreateUserModalComponent,
      CreateUserRequest,
      CreateUserRequest
    >(CreateUserModalComponent, {
      width: MODAL_WIDTH,
      data: {
        username: '',
        name: '',
        password: '',
        passwordConfirmation: '',
        isAdmin: false,
        canUpdate: false,
        canCreate: false,
        canDelete: false,
        canRead: true,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._usersFacade.createUser(result);
        }
      });
  }

  onEditUserInfo(data: EditUserInfoRequest): void {
    const dialogRef = this._dialog.open<
      EditInfoModalComponent,
      EditUserInfoRequest,
      EditUserInfoRequest
    >(EditInfoModalComponent, {
      width: MODAL_WIDTH,
      data: data,
    });

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._usersFacade.editUserInfo(result);
        }
      });
  }

  onEditUserCredentials(data: EditUserCredentialsRequest): void {
    const dialogRef = this._dialog.open<
      EditCredentialsModalComponent,
      EditUserCredentialsRequest,
      EditUserCredentialsRequest
    >(EditCredentialsModalComponent, {
      width: MODAL_WIDTH,
      data: data,
    });

    dialogRef
      .afterClosed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this._usersFacade.editUserCredentials(result);
        }
      });
  }

  onDelete(id: string): void {
    const dialogRef = this._dialog.open<
      DeleteUserModalComponent,
      DeleteUserRequest,
      DeleteUserRequest
    >(DeleteUserModalComponent, {
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
          this._usersFacade.deleteUser(result);
        }
      });
  }

  private _getUsers(pageIndex = 0): void {
    const selectedFilters = this.selectedFilters();

    const { filters, sorters } = this._usersService.getSortersAndFiltersForRequest(
      selectedFilters,
      this.currentSort
    );

    this._usersFacade.updatePaginationData({
      pageIndex,
      pageSize: this.currentPageSize,
      search: this.searchValue,
      sorters: sorters ? [sorters] : [],
      filters: filters,
    });
  }
}
