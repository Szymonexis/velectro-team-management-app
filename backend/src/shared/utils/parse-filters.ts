import { isNil } from 'lodash';

export function parseFilters(
  filters: string[] | undefined,
  dbKeyTransformers: Record<string, (value: string) => any>,
): Record<string, any> {
  if (isNil(filters)) {
    return {};
  }

  return filters.reduce<Record<string, any>>((acc, filter) => {
    const [key, value] = filter.split('=');

    if (!dbKeyTransformers[key]) {
      return acc;
    }

    const transformedValue = dbKeyTransformers[key](value);

    if (isNil(transformedValue)) {
      return acc;
    }

    acc[key] = transformedValue;

    return acc;
  }, {});
}
