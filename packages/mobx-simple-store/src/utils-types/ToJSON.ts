import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";

import { Nullable } from "./Nullable";

export type ToJSON<T extends MSSModel<any, any, any>> = T extends MSSModel<
  infer O,
  any,
  any
>
  ? {
      // Model
      [K in keyof O]: O[K] extends MSSModel<any, any, any>
        ? ToJSON<O[K]>
        : // Array
        O[K] extends MSSArray<infer C>
        ? C extends MSSModel<any, any, any>
          ? ToJSON<C>[]
          : C[]
        : // MaybeNull
        O[K] extends MSSMaybeNull<infer C>
        ? C extends MSSModel<any, any, any>
          ? Nullable<ToJSON<C>>
          : C extends MSSArray<infer D>
          ? D extends MSSModel<any, any, any>
            ? Nullable<ToJSON<D>>
            : Nullable<D[]>
          : Nullable<C>
        : // Normal Return
          O[K];
    }
  : never;
