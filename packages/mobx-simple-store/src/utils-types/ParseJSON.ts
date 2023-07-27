import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";

import { Nullable } from "./Nullable";

type ToJSONRequired<T> = {
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
    ? never
    : // Normal Return
      T[K];
};

type ToJSON<T> = Omit<
  {
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
      ? never
      : // Normal Return
        T[K];
  },
  keyof T extends MSSMaybeNull<any> ? keyof T : never
> & {
  [K in keyof T]?: T[K] extends MSSMaybeNull<infer C>
    ? C extends MSSModel<infer O, any, any>
      ? Nullable<ToJSON<O>>
      : C extends MSSArray<infer D>
      ? D extends MSSModel<infer O, any, any>
        ? Nullable<ToJSON<O>[]>
        : Nullable<D[]>
      : Nullable<C>
    : never;
};

export type ParseJSON<T> = T extends MSSModel<infer O, any, any>
  ? ToJSON<O>
  : never;

type GetOptionalKeys<T> = {
  [K in keyof T]: number extends T[K] ? K : never;
}[keyof T];
type GetNotOptionalKeys<T> = {
  [K in keyof T]: number extends T[K] ? never : K;
}[keyof T];

type ToJS<T> = {
  [K in keyof Omit<T, GetOptionalKeys<T>>]: Omit<
    T,
    GetOptionalKeys<T>
  >[K] extends number
    ? never
    : Omit<T, GetOptionalKeys<T>>[K];
} & {
  [K in keyof Omit<T, GetNotOptionalKeys<T>>]?: Omit<
    T,
    GetNotOptionalKeys<T>
  >[K];
};

const obj = {
  a: 1,
  b: 2,
  c: "3",
  d: "333",
};

const jsObj: ToJS<typeof obj> = {
  c: "3",
  d: "333",
};
