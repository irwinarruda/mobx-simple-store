import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";
import { NotNullableKeys } from "./NotNullableKeys";
import { Nullable } from "./Nullable";
import { NullableKeys } from "./NullableKeys";

type ToJSON<T> = {
  [K in NotNullableKeys<T>]: T[K] extends MSSModel<infer O, any, any> // Model
    ? ToJSON<O>
    : T[K] extends MSSArray<infer C> // Array
    ? C extends MSSModel<infer O, any, any> // Array of Model
      ? ToJSON<O>[]
      : C extends MSSMaybeNull<infer D> // Array of MaybeNull
      ? D extends MSSModel<infer E, any, any> // Array of MaybeNull of Model
        ? Nullable<ToJSON<E>>[]
        : Nullable<D>[]
      : C[]
    : T[K];
} & {
  [K in NullableKeys<T>]?: T[K] extends MSSMaybeNull<infer C> // MaybeNull
    ? C extends MSSModel<infer O, any, any> // MaybeNull of Model
      ? Nullable<ToJSON<O>>
      : C extends MSSArray<infer D> // MaybeNull of Array
      ? D extends MSSModel<infer O, any, any> // MaybeNull of Array of Model
        ? Nullable<ToJSON<O>[]>
        : D extends MSSMaybeNull<infer E> // MaybeNull of Array of MaybeNull
        ? E extends MSSModel<infer F, any, any> // MaybeNull of Array of MaybeNull of Model
          ? Nullable<Nullable<ToJSON<F>>[]>
          : Nullable<Nullable<E>[]>
        : Nullable<D[]>
      : Nullable<C>
    : never;
};

export type ParseJSON<T> = T extends MSSModel<infer O, any, any>
  ? ToJSON<O>
  : never;
