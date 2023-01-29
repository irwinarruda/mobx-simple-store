import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";

import { ParseActions } from "./ParseActions";
import { Nullable } from "./Nullable";
import { ObservableArray } from "./ObservableArray";

export type ParseObservables<T> = {
  // Model
  [P in keyof T]: T[P] extends MSSModel<infer O, infer V, infer A>
    ? ParseObservables<O & V & ParseActions<A>>
    : // Array
    T[P] extends MSSArray<infer C>
    ? C extends MSSModel<infer O, infer V, infer A>
      ? ObservableArray<ParseObservables<O & V & ParseActions<A>>, O>
      : ObservableArray<C>
    : // MaybeNul
    T[P] extends MSSMaybeNull<infer C>
    ? C extends MSSModel<infer O, infer V, infer A>
      ? Nullable<ParseObservables<O & V & ParseActions<A>>>
      : C extends MSSArray<infer D>
      ? D extends MSSModel<infer O, infer V, infer A>
        ? Nullable<
            ObservableArray<ParseObservables<O & V & ParseActions<A>>, O>
          >
        : Nullable<ObservableArray<D>>
      : Nullable<C>
    : // Normal Return
      T[P];
};
