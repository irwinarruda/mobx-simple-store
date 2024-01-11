export type FixArgType<T> = T extends boolean
  ? boolean
  : T extends string | number
    ? string | number
    : T;
