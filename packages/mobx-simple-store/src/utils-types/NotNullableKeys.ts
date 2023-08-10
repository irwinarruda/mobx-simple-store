import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";

export type NotNullableKeys<T> = {
  [K in keyof T]: T[K] extends MSSModel<any, any, any>
    ? K
    : T[K] extends MSSArray<any>
    ? K
    : T[K] extends MSSMaybeNull<any>
    ? never
    : K;
}[keyof T];
