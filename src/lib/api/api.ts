type Result<T extends string, R> = Record<T, R>;

export function searchParamsExtractor<T extends string>(
  searchParams: URLSearchParams,
  keys: T[],
): Result<T, string | undefined> {
  const result = {} as Result<T, string | undefined>;

  // get string value if the result is not an empty string otherwise return undefined
  for (const key of keys) {
    const value = searchParams.get(key);
    result[key] = value || undefined;
  }

  return result;
}
