import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";

import { Nullable } from "./Nullable";

type NullableKeys<T> = {
  [K in keyof T]: T[K] extends MSSModel<any, any, any>
    ? never
    : T[K] extends MSSArray<any>
    ? never
    : T[K] extends MSSMaybeNull<any>
    ? K
    : never;
}[keyof T];

type NotNullableKeys<T> = {
  [K in keyof T]: T[K] extends MSSModel<any, any, any>
    ? K
    : T[K] extends MSSArray<any>
    ? K
    : T[K] extends MSSMaybeNull<any>
    ? never
    : K;
}[keyof T];

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
  [K in NullableKeys<T>]?: T[K] extends MSSMaybeNull<infer C>
    ? C extends MSSModel<infer O, any, any> // Model
      ? Nullable<ToJSON<O>>
      : C extends MSSArray<infer D> // Array
      ? D extends MSSModel<infer O, any, any> // Array of Model
        ? Nullable<ToJSON<O>[]>
        : Nullable<D[]>
      : Nullable<C>
    : never;
};

export type ParseJSON<T> = T extends MSSModel<infer O, any, any>
  ? ToJSON<O>
  : never;
