import { MSSArray } from "@models/MSSArray";

export function array<T>(child: T) {
  return new MSSArray(child);
}
