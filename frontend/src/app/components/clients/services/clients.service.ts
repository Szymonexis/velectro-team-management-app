import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { Params } from '@angular/router';

import { ClientsFacade } from '../../../store/clients/clients.facade';
import {
  ClientFilterFieldKeys,
  ClientQueryKeys,
  InitialCheckedFiltersType,
  SorterAndFiltersForRequest,
} from '../clients.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly _clientsFacade = inject(ClientsFacade);

  updateStoreParamsFromQueryParams(queryParams: Params): void {
    let search = '';
    const sorters: string[] = [];
    const filters: string[] = [];
    const filtersFromQuery = queryParams?.[ClientQueryKeys.filters];
    const sortersFromQuery = queryParams?.[ClientQueryKeys.sorters];

    const pageIndex = Number(queryParams?.[ClientQueryKeys.pageIndex] ?? 0);
    const pageSize = Number(queryParams?.[ClientQueryKeys.pageSize] ?? 10);
    search = queryParams?.[ClientQueryKeys.search] ?? '';

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

    this._clientsFacade.updatePaginationData({
      pageIndex,
      pageSize,
      search,
      sorters,
      filters,
    });
  }

  getParsedPaginationData$(): Observable<{
    filters: Partial<Record<ClientFilterFieldKeys, string>>;
    sorters: Sort[];
    search: string;
  }> {
    return this._clientsFacade.paginationData$.pipe(
      map((paginationData) => {
        const sorters = paginationData.sorters.map((sorter) => {
          const activeSorter = sorter.startsWith('-') ? sorter.slice(1) : sorter;
          const direction: SortDirection = sorter.startsWith('-') ? 'desc' : 'asc';
          return { active: activeSorter, direction };
        });
        const searchValue = paginationData.search;

        return { filters: [], sorters: sorters, search: searchValue };
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
