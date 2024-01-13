import { HandleViews } from "./HandleViews";
import { ToJSON } from "./ParseJSON";

export type ParseActions<A, O, V> = {
  [P in keyof A]: A[P] extends (
    ...args: infer A
  ) => Generator<Promise<any>, infer R, any>
    ? (...args: A) => Promise<R>
    : A[P];
} & {
  toJS?: <I extends boolean>(args?: {
    includeViews?: I;
  }) => ToJSON<HandleViews<O, V, I>, I>;
};
