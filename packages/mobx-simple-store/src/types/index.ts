import { array } from "./array";
import { compose } from "./compose";
import { constant } from "./constant";
import { frozen } from "./frozen";
import { maybeNull } from "./maybeNull";
import { model } from "./model";

export const types = {
  string: String(),
  number: Number(),
  stringOrNumber: String() as number | string,
  boolean: Boolean(),
  constant,
  frozen,
  array,
  compose,
  maybeNull,
  model,
};
