import { MSSModel } from "@models/MSSModel";
import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";

import { Nullable } from "./Nullable";
import { ObservableArray } from "./ObservableArray";

import { ParseActions } from "./ParseActions";

type ToModel<T> = {
  // Model
  [P in keyof T]: T[P] extends MSSModel<infer O, infer V, infer A>
    ? ToModel<O & V & ParseActions<A>>
    : // Array
    T[P] extends MSSArray<infer C>
    ? C extends MSSModel<infer O, infer V, infer A>
      ? ObservableArray<ToModel<O & V & ParseActions<A>>, O>
      : ObservableArray<C>
    : // MaybeNul
    T[P] extends MSSMaybeNull<infer C>
    ? C extends MSSModel<infer O, infer V, infer A>
      ? Nullable<ToModel<O & V & ParseActions<A>>>
      : C extends MSSArray<infer D>
      ? D extends MSSModel<infer O, infer V, infer A>
        ? Nullable<ObservableArray<ToModel<O & V & ParseActions<A>>, O>>
        : Nullable<ObservableArray<D>>
      : Nullable<C>
    : // Normal Return
      T[P];
};

export type ParseModel<T> = T extends MSSModel<infer O, infer V, infer A>
  ? ToModel<O & V & ParseActions<A>>
  : never;
