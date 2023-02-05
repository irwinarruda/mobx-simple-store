import { MSSModel } from "@models/MSSModel";

import { ParseObservables } from "./ParseObservables";
import { ParseActions } from "./ParseActions";

export type ParseModel<T extends MSSModel<any, any, any>> = T extends MSSModel<
  infer O,
  infer V,
  infer A
>
  ? ParseObservables<O & V & ParseActions<A>>
  : never;
