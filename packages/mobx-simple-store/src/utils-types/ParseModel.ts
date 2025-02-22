import { MSSArray } from "@models/MSSArray";
import { MSSOptional } from "@models/MSSOptional";
import { MSSModel } from "@models/MSSModel";
import { FixArgType } from "./FixArgType";
import { NotNullableKeys } from "./NotNullableKeys";
import { Optional } from "./Optional";
import { NullableKeys } from "./NullableKeys";
import { ObservableArray } from "./ObservableArray";
import { ParseActions } from "./ParseActions";

export type ToModel<T> = Pick<
  {
    [P in keyof T]: T[P] extends MSSModel<infer O, infer OV, infer OA> // Model
      ? ToModel<O & OV & ParseActions<OA, O, OV>>
      : T[P] extends MSSArray<infer C> // Array
        ? C extends MSSModel<infer O, infer OV, infer OA> // Array of Model
          ? ObservableArray<ToModel<O & OV & ParseActions<OA, O, OV>>, O, OV>
          : C extends MSSOptional<infer D, infer IncludeNull> // Array of MaybeNull
            ? D extends MSSModel<infer E, infer EV, infer EA> // Array of MaybeNull of Model
              ? ObservableArray<
                  Optional<
                    ToModel<E & EV & ParseActions<EA, E, EV>>,
                    IncludeNull
                  >,
                  E,
                  EV,
                  true
                >
              : ObservableArray<Optional<FixArgType<D>>>
            : ObservableArray<FixArgType<C>>
        : T[P];
  },
  NotNullableKeys<T>
> &
  Pick<
    {
      [P in keyof T]?: T[P] extends MSSOptional<infer C, infer IncludeNull> // MaybeNull
        ? C extends MSSModel<infer O, infer V, infer A> // MaybeNull of Model
          ? Optional<ToModel<O & V & ParseActions<A, O, V>>, IncludeNull>
          : C extends MSSArray<infer D> // MaybeNull of Array
            ? D extends MSSModel<infer O, infer OV, infer OA> // MaybeNull of Array of Model
              ? Optional<
                  ObservableArray<
                    ToModel<O & OV & ParseActions<OA, O, OV>>,
                    O,
                    OV
                  >,
                  IncludeNull
                >
              : D extends MSSOptional<infer E, infer IncludeNullChild> // MaybeNull of Array of MaybeNull
                ? E extends MSSModel<infer F, infer FV, infer FA> // MaybeNull of Array of MaybeNull of Model
                  ? Optional<
                      ObservableArray<
                        Optional<
                          ToModel<F & FV & ParseActions<FA, F, FV>>,
                          IncludeNullChild
                        >,
                        F,
                        FV,
                        true
                      >,
                      IncludeNull
                    >
                  : Optional<
                      ObservableArray<
                        Optional<FixArgType<E>>,
                        IncludeNullChild
                      >,
                      IncludeNull
                    >
                : Optional<ObservableArray<FixArgType<D>>, IncludeNull>
            : Optional<C, IncludeNull>
        : never;
    },
    NullableKeys<T>
  >;

export type ParseModel<T> =
  T extends MSSModel<infer O, infer V, infer A>
    ? ToModel<O & V & ParseActions<A, O, V>>
    : never;
