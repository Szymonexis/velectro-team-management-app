import { isNil } from 'lodash';

import { Prisma } from '@prisma/client';

export function parseSorters(
  sorters: string[] | undefined,
  dbKeys: string[],
  defaultSorterKey: string,
): [string, Prisma.SortOrder][] {
  const defaultSorterTuple: [string, Prisma.SortOrder] = [
    defaultSorterKey,
    'asc',
  ];

  if (isNil(sorters)) {
    return [defaultSorterTuple];
  }

  const sorterTuples = sorters
    .map<[string, Prisma.SortOrder] | null>((sorter) => {
      const key = sorter.replace('-', '');

      if (!dbKeys.includes(key)) {
        return null;
      }

      return [key, sorter.startsWith('-') ? 'desc' : 'asc'];
    })
    .filter<[string, Prisma.SortOrder]>((sorter) => !isNil(sorter));

  if (sorterTuples.length === 0) {
    return [defaultSorterTuple];
  }

  if (sorterTuples.some(([key]) => key === defaultSorterKey)) {
    return sorterTuples;
  }

  return [...sorterTuples, [defaultSorterKey, 'asc']];
}
