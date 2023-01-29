import { MSSModel } from "@models/MSSModel";

export function model<T extends Record<string, any>>(data: T) {
  return new MSSModel(data);
}
