import { MSSArray } from "@models/MSSArray";
import { MSSMaybeNull } from "@models/MSSMaybeNull";
import { MSSModel } from "@models/MSSModel";
import { FixArgType } from "./FixArgType";
import { NotNullableKeys } from "./NotNullableKeys";
import { Nullable } from "./Nullable";
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
          : C extends MSSMaybeNull<infer D> // Array of MaybeNull
            ? D extends MSSModel<infer E, infer EV, infer EA> // Array of MaybeNull of Model
              ? ObservableArray<
                  Nullable<ToModel<E & EV & ParseActions<EA, E, EV>>>,
                  E,
                  EV,
                  true
                >
              : ObservableArray<Nullable<FixArgType<D>>>
            : ObservableArray<FixArgType<C>>
        : T[P];
  },
  NotNullableKeys<T>
> &
  Pick<
    {
      [P in keyof T]?: T[P] extends MSSMaybeNull<infer C> // MaybeNull
        ? C extends MSSModel<infer O, infer V, infer A> // MaybeNull of Model
          ? Nullable<ToModel<O & V & ParseActions<A, O, V>>>
          : C extends MSSArray<infer D> // MaybeNull of Array
            ? D extends MSSModel<infer O, infer OV, infer OA> // MaybeNull of Array of Model
              ? Nullable<
                  ObservableArray<
                    ToModel<O & OV & ParseActions<OA, O, OV>>,
                    O,
                    OV
                  >
                >
              : D extends MSSMaybeNull<infer E> // MaybeNull of Array of MaybeNull
                ? E extends MSSModel<infer F, infer FV, infer FA> // MaybeNull of Array of MaybeNull of Model
                  ? Nullable<
                      ObservableArray<
                        Nullable<ToModel<F & FV & ParseActions<FA, F, FV>>>,
                        F,
                        FV,
                        true
                      >
                    >
                  : Nullable<ObservableArray<Nullable<FixArgType<E>>>>
                : Nullable<ObservableArray<FixArgType<D>>>
            : Nullable<C>
        : never;
    },
    NullableKeys<T>
  >;

export type ParseModel<T> = T extends MSSModel<infer O, infer V, infer A>
  ? ToModel<O & V & ParseActions<A, O, V>>
  : never;
