import { MSSArray } from "@models/MSSArray";
import { MSSOptional } from "@models/MSSOptional";
import { MSSModel } from "@models/MSSModel";

export type NotNullableKeys<T> = {
  [K in keyof T]: T[K] extends MSSModel<any, any, any>
    ? K
    : T[K] extends MSSArray<any>
      ? K
      : T[K] extends MSSOptional<any, any>
        ? never
        : K;
}[keyof T];
