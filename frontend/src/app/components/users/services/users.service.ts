import { isNil } from 'lodash-es';
import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute, Params } from '@angular/router';

import { UserPaginatedArrayResponse } from '../../../core/http/users/types/response.types';
import { DEFAULT_PAGINATION_DATA, PaginationData } from '../../../store/shared';
import { UsersFacade } from '../../../store/users/users.facade';
import {
  FilterFields,
  InitialCheckedFiltersType,
  SorterAndFiltersForRequest,
  USER_FILTER_FIELDS,
  UserFilterField,
  UserFilterFieldKeys,
  UserQueryKeys,
} from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _usersFacade = inject(UsersFacade);
  private readonly _route = inject(ActivatedRoute);

  getFilterFields$(data: Observable<UserPaginatedArrayResponse | null>): Observable<FilterFields> {
    return data.pipe(
      map((data) => {
        if (isNil(data?.filterFields)) {
          return [];
        }

        return data.filterFields
          .map((filter: UserFilterField) => {
            if (isNil(filter?.key)) {
              return null;
            }

            if (!Object.keys(UserFilterFieldKeys).includes(filter.key as UserFilterFieldKeys)) {
              return null;
            }

            const filterField = USER_FILTER_FIELDS[filter.key as UserFilterFieldKeys];

            return {
              ...filterField,
              value: filterField.options[0],
              key: filter.key as UserFilterFieldKeys,
            };
          })
          .filter(Boolean) as FilterFields;
      })
    );
  }

  getParsedPaginationData$(): Observable<{
    filters: Partial<Record<UserFilterFieldKeys, string>>;
    sorters: Sort[];
    search: string;
  }> {
    return this._usersFacade.paginationData$.pipe(
      map((paginationData) => {
        const filters = paginationData.filters.reduce(
          (acc, filter) => {
            const [key, value] = filter.split('=') as [string, string];

            if (Object.values(UserFilterFieldKeys).includes(key as UserFilterFieldKeys)) {
              acc[key as UserFilterFieldKeys] = value;
            }
            return acc;
          },
          {} as Partial<Record<UserFilterFieldKeys, string>>
        );

        const sorters = paginationData.sorters.map((sorter) => {
          const activeSorter = sorter.startsWith('-') ? sorter.slice(1) : sorter;
          const direction: SortDirection = sorter.startsWith('-') ? 'desc' : 'asc';
          return { active: activeSorter, direction };
        });

        const searchValue = paginationData.search;
        return { filters, sorters: sorters, search: searchValue };
      })
    );
  }

  buildLinkQuery(data: PaginationData): void {
    const { pageIndex, pageSize, sorters, filters, search } = {
      ...DEFAULT_PAGINATION_DATA,
      ...data,
    };

    let linkQuery = `?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`;

    if (sorters.length) {
      sorters.forEach((sorter) => {
        linkQuery = linkQuery.concat(`&sorters=${sorter}`);
      });
    }

    if (filters.length) {
      filters.forEach((filter) => {
        linkQuery = linkQuery.concat(`&filters=${filter}`);
      });
    }
    const baseUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', baseUrl + linkQuery);
  }

  getLinkQuery(data: PaginationData): string {
    const { pageIndex, pageSize, sorters, filters, search } = {
      ...DEFAULT_PAGINATION_DATA,
      ...data,
    };

    let linkQuery = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    if (search) {
      linkQuery = linkQuery.concat(`&search=${search}`);
    }

    if (sorters?.length) {
      sorters.forEach((sorter) => {
        linkQuery = linkQuery.concat(`&sorters=${sorter}`);
      });
    }

    if (filters?.length) {
      filters.forEach((filter) => {
        linkQuery = linkQuery.concat(`&filters=${filter}`);
      });
    }

    return linkQuery;
  }

  getPaginationData(): PaginationData {
    let { pageIndex, pageSize, search, sorters, filters } = DEFAULT_PAGINATION_DATA;

    this._route.queryParamMap.pipe(
      map((params) => {
        pageIndex = Number(params.get(UserQueryKeys.pageIndex) ?? pageIndex);
        pageSize = Number(params.get(UserQueryKeys.pageSize) ?? pageSize);
        search = params.get(UserQueryKeys.search) ?? search;
        sorters = params.getAll(UserQueryKeys.sorters) ?? sorters;
        filters = params.getAll(UserQueryKeys.filters) ?? filters;
      })
    );

    return {
      pageIndex,
      pageSize,
      search,
      sorters,
      filters,
    };
  }

  updateStoreParamsFromString(queryString: string): void {
    let { pageIndex, pageSize, search, sorters, filters } = DEFAULT_PAGINATION_DATA;

    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((value, key) => {
      switch (key) {
        case UserQueryKeys.pageIndex:
          pageIndex = Number(value);
          break;
        case UserQueryKeys.pageSize:
          pageSize = Number(value);
          break;
        case UserQueryKeys.search:
          search = value;
          break;
        case UserQueryKeys.sorters:
          sorters = [...sorters, value];
          break;
        case UserQueryKeys.filters:
          filters = [...filters, value];
          break;
      }
    });

    this._usersFacade.updatePaginationData({
      pageIndex,
      pageSize,
      search,
      sorters,
      filters,
    });
  }

  updateStoreParamsFromQueryParams(queryParams: Params): void {
    let { pageIndex, pageSize, search, sorters, filters } = DEFAULT_PAGINATION_DATA;
    const filtersFromQuery = queryParams?.[UserQueryKeys.filters];
    const sortersFromQuery = queryParams?.[UserQueryKeys.sorters];

    pageIndex = Number(queryParams?.[UserQueryKeys.pageIndex] ?? pageIndex);
    pageSize = Number(queryParams?.[UserQueryKeys.pageSize] ?? pageSize);
    search = queryParams?.[UserQueryKeys.search] ?? search;

    filters = [
      ...filters,
      ...(Array.isArray(filtersFromQuery)
        ? filtersFromQuery
        : filtersFromQuery
          ? [filtersFromQuery]
          : []),
    ];

    sorters = [
      ...sorters,
      ...(Array.isArray(sortersFromQuery)
        ? sortersFromQuery
        : sortersFromQuery
          ? [sortersFromQuery]
          : []),
    ];

    this._usersFacade.updatePaginationData({
      pageIndex,
      pageSize,
      search,
      sorters,
      filters,
    });
  }

  getCurrentSortDirection(currentSort: Sort): string | undefined {
    return currentSort.direction
      ? currentSort.direction === 'desc'
        ? `-${currentSort.active}`
        : currentSort.active
      : undefined;
  }

  getSortersAndFiltersForRequest(
    checkedFilters: InitialCheckedFiltersType,
    currentSort: Sort
  ): SorterAndFiltersForRequest {
    const filters = Object.entries(checkedFilters).filter(([, value]) => value.value !== null);

    const selectedFilters = filters.map(([key, value]) => {
      return `${key}=${value.value}`;
    });

    const sorter = this.getCurrentSortDirection(currentSort);

    return { filters: selectedFilters, sorters: sorter };
  }
}
