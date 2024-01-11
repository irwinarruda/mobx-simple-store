export type FixArgType<T> = T extends boolean
  ? boolean
  : T extends string
    ? T extends number
      ? string | number
      : string
    : T;
