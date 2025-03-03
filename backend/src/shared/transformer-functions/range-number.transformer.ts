import { FilterRange } from './helper.types';

export function rangeNumberTransformer(
  value: string,
): FilterRange<number> | null {
  try {
    const [gte, lt] = value.split(':').map(parseFloat);

    return { gte, lt };
  } catch {
    return null;
  }
}
