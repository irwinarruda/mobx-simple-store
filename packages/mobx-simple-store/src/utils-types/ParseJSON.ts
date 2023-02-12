import { MSSModel } from "@models/MSSModel";
import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";

import { Nullable } from "./Nullable";

type ToJSON<T> = {
  // Model
  [K in keyof T]: T[K] extends MSSModel<infer O, any, any>
    ? ToJSON<O>
    : // Array
    T[K] extends MSSArray<infer C>
    ? C extends MSSModel<infer O, any, any>
      ? ToJSON<O>[]
      : C[]
    : // MaybeNull
    T[K] extends MSSMaybeNull<infer C>
    ? C extends MSSModel<infer O, any, any>
      ? Nullable<ToJSON<O>>
      : C extends MSSArray<infer D>
      ? D extends MSSModel<infer O, any, any>
        ? Nullable<ToJSON<O>[]>
        : Nullable<D[]>
      : Nullable<C>
    : // Normal Return
      T[K];
};

export type ParseJSON<T> = T extends MSSModel<infer O, any, any>
  ? ToJSON<O>
  : never;
