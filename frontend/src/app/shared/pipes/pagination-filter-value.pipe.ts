import { Pipe, PipeTransform } from '@angular/core';

import { FilterFieldTypes, FilterRange } from '../models/pagination.model';

@Pipe({
  standalone: true,
  name: 'filterValue',
})
export class PaginationFilterValuePipe implements PipeTransform {
  transform(
    value: string | null,
    type: FilterFieldTypes
  ): string | boolean | number | Date | FilterRange<number> | FilterRange<Date> | null {
    if (value === null) {
      return null;
    }

    switch (type) {
      case FilterFieldTypes.String:
        return value;
      case FilterFieldTypes.Boolean:
        return value === 'true';
      case FilterFieldTypes.Number:
        return Number(value);
      case FilterFieldTypes.Date:
        return new Date(value);
      case FilterFieldTypes.RangeNumber: {
        const [min, max] = value.split(':');
        const range: FilterRange<number> = {
          min: Number(min),
          max: Number(max),
        };

        return range;
      }

      case FilterFieldTypes.RangeDate: {
        const [min, max] = value.split(':');
        const range: FilterRange<Date> = {
          min: new Date(min),
          max: new Date(max),
        };

        return range;
      }

      default:
        return null;
    }
  }
}
