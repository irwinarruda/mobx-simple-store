export type Or<P, T> = P extends undefined
  ? P extends null
    ? P extends never
      ? T
      : T
    : T
  : P;
