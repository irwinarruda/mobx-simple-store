import { HandleViews } from "./HandleViews";
import { Optional } from "./Optional";
import { ToJSON } from "./ParseJSON";

type HandleModel<M, P, IsNull = false> = M extends undefined
  ? P
  : IsNull extends true
    ? Optional<ToJSON<M>>
    : ToJSON<M>;

export interface ObservableArray<
  T,
  O = undefined,
  V = undefined,
  IsNull = false,
> extends Omit<Array<T>, "replace" | "push" | "unshift" | "splice"> {
  toJS?: <I extends boolean>(args?: {
    includeViews?: I;
  }) => HandleModel<HandleViews<O, V, I>, T, IsNull>[];
  push(...value: HandleModel<O, T, IsNull>[]): number;
  unshift(...value: HandleModel<O, T, IsNull>[]): number;
  splice(
    start: number,
    deleteCount?: number | undefined,
    ...value: HandleModel<O, T, IsNull>[]
  ): T[];
}
