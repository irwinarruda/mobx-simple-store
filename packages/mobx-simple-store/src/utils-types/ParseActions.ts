export type ParseActions<A, J> = {
  [P in keyof A]: A[P] extends (
    ...args: infer A
  ) => Generator<Promise<any>, infer R, any>
    ? (...args: A) => Promise<R>
    : A[P];
} & {
  toJS: () => J;
};
