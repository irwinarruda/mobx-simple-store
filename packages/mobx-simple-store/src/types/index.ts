import { array } from "./array";
import { compose } from "./compose";
import { maybeNull } from "./maybeNull";
import { model } from "./model";

export const types = {
  string: String(),
  number: Number(),
  stringOrNumber: String() as number | string,
  boolean: Boolean(),
  array,
  compose,
  maybeNull,
  model,
};
