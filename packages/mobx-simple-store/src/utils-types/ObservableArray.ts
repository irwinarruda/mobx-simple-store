import { HandleViews } from "./HandleViews";
import { Or } from "./Or";
import { ToJSON } from "./ParseJSON";

export interface ObservableArray<T, O = undefined, V = undefined>
  extends Omit<Array<T>, "replace" | "push" | "unshift" | "splice"> {
  toJS?: <I extends boolean>(args?: {
    includeViews?: I;
  }) => Or<ToJSON<HandleViews<O, V, I>, I>, T>[];
  push(...value: Or<ToJSON<O>, T>[]): number;
  unshift(...value: Or<ToJSON<O>, T>[]): number;
  splice(
    start: number,
    deleteCount?: number | undefined,
    ...value: Or<ToJSON<O>, T>[]
  ): T[];
}
