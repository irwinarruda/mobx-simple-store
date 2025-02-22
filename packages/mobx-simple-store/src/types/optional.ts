import { MSSOptional } from "@models/MSSOptional";

export function optional<T>(child: T) {
  return new MSSOptional(child, false);
}
