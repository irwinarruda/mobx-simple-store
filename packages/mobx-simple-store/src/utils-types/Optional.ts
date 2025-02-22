export type Optional<T, IncludeNull = false> = IncludeNull extends true
  ? T | null | undefined
  : T | undefined;
