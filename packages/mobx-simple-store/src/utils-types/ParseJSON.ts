import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";
import { FixArgType } from "./FixArgType";
import { HandleViews } from "./HandleViews";
import { NotNullableKeys } from "./NotNullableKeys";
import { Nullable } from "./Nullable";
import { NullableKeys } from "./NullableKeys";

export type ToJSON<T, IncludeViews = false> = {
  [K in NotNullableKeys<T>]: T[K] extends MSSModel<infer O, infer V, any> // Model
    ? ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>
    : T[K] extends MSSArray<infer C> // Array
      ? C extends MSSModel<infer O, infer V, any> // Array of Model
        ? ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>[]
        : C extends MSSMaybeNull<infer D> // Array of MaybeNull
          ? D extends MSSModel<infer E, infer EV, any> // Array of MaybeNull of Model
            ? Nullable<ToJSON<HandleViews<E, EV, IncludeViews>, IncludeViews>>[]
            : Nullable<FixArgType<D>>[]
          : FixArgType<C>[]
      : T[K];
} & {
  [K in NullableKeys<T>]?: T[K] extends MSSMaybeNull<infer C> // MaybeNull
    ? C extends MSSModel<infer O, infer V, any> // MaybeNull of Model
      ? Nullable<ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>>
      : C extends MSSArray<infer D> // MaybeNull of Array
        ? D extends MSSModel<infer O, infer V, any> // MaybeNull of Array of Model
          ? Nullable<ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>[]>
          : D extends MSSMaybeNull<infer E> // MaybeNull of Array of MaybeNull
            ? E extends MSSModel<infer F, infer EF, any> // MaybeNull of Array of MaybeNull of Model
              ? Nullable<
                  Nullable<
                    ToJSON<HandleViews<F, EF, IncludeViews>, IncludeViews>
                  >[]
                >
              : Nullable<Nullable<FixArgType<E>>[]>
            : Nullable<FixArgType<D>[]>
        : Nullable<C>
    : never;
};

export type ParseJSON<T, IncludeViews = false> = T extends MSSModel<
  infer O,
  infer V,
  any
>
  ? ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>
  : never;
