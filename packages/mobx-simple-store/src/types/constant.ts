import { MSSConstant } from "@models/MSSConstant";

export function constant<T>() {
  // For now, there is no need to change util-types. That's why "as T" is used.
  return new MSSConstant<T>() as T;
}
