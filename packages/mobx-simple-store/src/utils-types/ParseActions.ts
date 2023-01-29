export type ParseActions<T> = {
  [P in keyof T]: T[P] extends (
    ...args: infer A
  ) => Generator<Promise<any>, infer R, any>
    ? (...args: A) => Promise<R>
    : T[P];
};
