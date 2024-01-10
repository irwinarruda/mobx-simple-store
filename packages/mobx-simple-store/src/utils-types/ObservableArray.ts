import { Or } from "./Or";

export interface ObservableArray<T, P = undefined>
  extends Omit<Array<T>, "replace" | "push" | "unshift" | "splice"> {
  toJS?: () => Or<P, T>[];
  push(...value: Or<P, T>[]): number;
  unshift(...value: Or<P, T>[]): number;
  splice(
    start: number,
    deleteCount?: number | undefined,
    ...value: Or<P, T>[]
  ): T[];
}
