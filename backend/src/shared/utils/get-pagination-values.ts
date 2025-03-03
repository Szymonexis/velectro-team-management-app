export function getPaginationValues({
  pageIndex,
  pageSize,
  totalCount,
}: {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}): {
  skip: number;
  take: number;
  correctedPageIndex: number;
} {
  const providedSkip = pageIndex * pageSize;
  const skip = totalCount < providedSkip ? 0 : providedSkip;
  const take = pageSize;
  const correctedPageIndex = Math.floor(skip / pageSize);

  return {
    skip,
    take,
    correctedPageIndex,
  };
}
