import { MSSModel } from "@models/MSSModel";
import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";

export type NullableKeys<T> = {
  [K in keyof T]: T[K] extends MSSModel<any, any, any>
    ? never
    : T[K] extends MSSArray<any>
    ? never
    : T[K] extends MSSMaybeNull<any>
    ? K
    : never;
}[keyof T];
