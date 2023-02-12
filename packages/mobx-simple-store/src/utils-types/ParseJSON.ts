import { MSSModel } from "@models/MSSModel";
import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";

import { Nullable } from "./Nullable";

type ToJSON<T> = {
  // Model
  [K in keyof T]: T[K] extends MSSModel<any, any, any>
    ? ToJSON<T[K]>
    : // Array
    T[K] extends MSSArray<infer C>
    ? C extends MSSModel<any, any, any>
      ? ToJSON<C>[]
      : C[]
    : // MaybeNull
    T[K] extends MSSMaybeNull<infer C>
    ? C extends MSSModel<any, any, any>
      ? Nullable<ToJSON<C>>
      : C extends MSSArray<infer D>
      ? D extends MSSModel<any, any, any>
        ? Nullable<ToJSON<D>[]>
        : Nullable<D[]>
      : Nullable<C>
    : // Normal Return
      T[K];
};

export type ParseJSON<T> = T extends MSSModel<infer O, any, any>
  ? ToJSON<O>
  : never;
