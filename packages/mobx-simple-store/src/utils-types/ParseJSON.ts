import { MSSModel } from "@models/MSSModel";
import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";

import { Nullable } from "./Nullable";

export type ParseJSON<T extends MSSModel<any, any, any>> = T extends MSSModel<
  infer O,
  any,
  any
>
  ? {
      // Model
      [K in keyof O]: O[K] extends MSSModel<any, any, any>
        ? ParseJSON<O[K]>
        : // Array
        O[K] extends MSSArray<infer C>
        ? C extends MSSModel<any, any, any>
          ? ParseJSON<C>[]
          : C[]
        : // MaybeNull
        O[K] extends MSSMaybeNull<infer C>
        ? C extends MSSModel<any, any, any>
          ? Nullable<ParseJSON<C>>
          : C extends MSSArray<infer D>
          ? D extends MSSModel<any, any, any>
            ? Nullable<ParseJSON<D>[]>
            : Nullable<D[]>
          : Nullable<C>
        : // Normal Return
          O[K];
    }
  : never;
