import { MSSArray } from "@models/MSSArray";
import { MSSOptional } from "@models/MSSOptional";
import { MSSModel } from "@models/MSSModel";
import { FixArgType } from "./FixArgType";
import { HandleViews } from "./HandleViews";
import { NotNullableKeys } from "./NotNullableKeys";
import { Optional } from "./Optional";
import { NullableKeys } from "./NullableKeys";

export type ToJSON<T, IncludeViews = false> = {
  [K in NotNullableKeys<T>]: T[K] extends MSSModel<infer O, infer V, any> // Model
    ? ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>
    : T[K] extends MSSArray<infer C> // Array
      ? C extends MSSModel<infer O, infer V, any> // Array of Model
        ? ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>[]
        : C extends MSSOptional<infer D, infer IncludeNull> // Array of MaybeNull
          ? D extends MSSModel<infer E, infer EV, any> // Array of MaybeNull of Model
            ? Optional<
                ToJSON<HandleViews<E, EV, IncludeViews>, IncludeViews>,
                IncludeNull
              >[]
            : Optional<FixArgType<D>, IncludeNull>[]
          : FixArgType<C>[]
      : T[K];
} & {
  [K in NullableKeys<T>]?: T[K] extends MSSOptional<infer C, infer IncludeNull> // MaybeNull
    ? C extends MSSModel<infer O, infer V, any> // MaybeNull of Model
      ? Optional<
          ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>,
          IncludeNull
        >
      : C extends MSSArray<infer D> // MaybeNull of Array
        ? D extends MSSModel<infer O, infer V, any> // MaybeNull of Array of Model
          ? Optional<
              ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>[],
              IncludeNull
            >
          : D extends MSSOptional<infer E, infer IncludeNullChild> // MaybeNull of Array of MaybeNull
            ? E extends MSSModel<infer F, infer EF, any> // MaybeNull of Array of MaybeNull of Model
              ? Optional<
                  Optional<
                    ToJSON<HandleViews<F, EF, IncludeViews>, IncludeViews>,
                    IncludeNullChild
                  >[],
                  IncludeNull
                >
              : Optional<
                  Optional<FixArgType<E>, IncludeNullChild>[],
                  IncludeNull
                >
            : Optional<FixArgType<D>[], IncludeNull>
        : Optional<C, IncludeNull>
    : never;
};

export type ParseJSON<T, IncludeViews = false> =
  T extends MSSModel<infer O, infer V, any>
    ? ToJSON<HandleViews<O, V, IncludeViews>, IncludeViews>
    : never;
