import { MSSMaybeNull } from "@models/MSSMaybeNull";

export function maybeNull<T>(child: T) {
  return new MSSMaybeNull(child);
}
