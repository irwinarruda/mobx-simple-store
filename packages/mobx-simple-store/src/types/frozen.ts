import { MSSFrozen } from "@models/MSSFrozen";

export function frozen<T>() {
  // For now, there is no need to change util-types. That's why "as T" is used.
  return new MSSFrozen<T>() as T;
}
