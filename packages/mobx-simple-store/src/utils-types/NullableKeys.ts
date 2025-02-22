import { MSSArray } from "@models/MSSArray";
import { MSSOptional } from "@models/MSSOptional";
import { MSSModel } from "@models/MSSModel";

export type NullableKeys<T> = {
  [K in keyof T]: T[K] extends MSSModel<any, any, any>
    ? never
    : T[K] extends MSSArray<any>
      ? never
      : T[K] extends MSSOptional<any, any>
        ? K
        : never;
}[keyof T];
