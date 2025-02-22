import { MSSOptional } from "@models/MSSOptional";

export function maybeNull<T>(child: T) {
  return new MSSOptional(child, true);
}
