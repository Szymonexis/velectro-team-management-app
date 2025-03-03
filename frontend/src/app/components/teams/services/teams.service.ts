import { isNil } from 'lodash-es';
import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { Params } from '@angular/router';

import { TeamArrayPaginatedResponse } from '../../../core/http/teams/types/response.types';
import { TeamsFacade } from '../../../store/teams/teams.facade';
import {
  FilterFields,
  InitialCheckedFiltersType,
  SorterAndFiltersForRequest,
  TEAM_FILTER_FIELDS,
  TeamFilterField,
  TeamFilterFieldKeys,
  TeamQueryKeys,
} from '../teams.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly _teamsFacade = inject(TeamsFacade);

  updateStoreParamsFromQueryParams(queryParams: Params): void {
    let pageIndex = 0;
    let pageSize = 10;
    let search = '';
    const sorters: string[] = [];
    const filters: string[] = [];
    const filtersFromQuery = queryParams?.[TeamQueryKeys.filters];
    const sortersFromQuery = queryParams?.[TeamQueryKeys.sorters];

    pageIndex = Number(queryParams?.[TeamQueryKeys.pageIndex] ?? 0);
    pageSize = Number(queryParams?.[TeamQueryKeys.pageSize] ?? 10);
    search = queryParams?.[TeamQueryKeys.search] ?? '';

    filters.push(
      ...(Array.isArray(filtersFromQuery)
        ? filtersFromQuery
        : filtersFromQuery
          ? [filtersFromQuery]
          : [])
    );
    sorters.push(
      ...(Array.isArray(sortersFromQuery)
        ? sortersFromQuery
        : sortersFromQuery
          ? [sortersFromQuery]
          : [])
    );

    this._teamsFacade.updatePaginationData({
      pageIndex,
      pageSize,
      search,
      sorters,
      filters,
    });
  }

  getParsedPaginationData$(): Observable<{
    filters: Partial<Record<TeamFilterFieldKeys, string>>;
    sorters: Sort[];
    search: string;
  }> {
    return this._teamsFacade.paginationData$.pipe(
      map((paginationData) => {
        const filters = paginationData.filters.reduce(
          (acc, filter) => {
            const [key, value] = filter.split('=') as [string, string];

            if (Object.values(TeamFilterFieldKeys).includes(key as TeamFilterFieldKeys)) {
              acc[key as TeamFilterFieldKeys] = value;
            }
            return acc;
          },
          {} as Partial<Record<TeamFilterFieldKeys, string>>
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

  getFilterFields$(data: Observable<TeamArrayPaginatedResponse | null>): Observable<FilterFields> {
    return data.pipe(
      map((data) => {
        if (isNil(data?.filterFields)) {
          return [];
        }

        return data.filterFields
          .map((filter: TeamFilterField) => {
            if (isNil(filter?.key)) {
              return null;
            }

            if (!Object.keys(TeamFilterFieldKeys).includes(filter.key as TeamFilterFieldKeys)) {
              return null;
            }

            const filterField = TEAM_FILTER_FIELDS[filter.key as TeamFilterFieldKeys];

            return {
              ...filterField,
              value: filterField.options[0],
              key: filter.key as TeamFilterFieldKeys,
            };
          })
          .filter(Boolean) as FilterFields;
      })
    );
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
      return `${key}=${value.value.min}:${value.value.max}`;
    });

    const sorter = this.getCurrentSortDirection(currentSort);

    return { filters: selectedFilters, sorters: sorter };
  }
}
