import { MSSModel } from "@models/MSSModel";

export function model<T extends object>(data: T) {
  return new MSSModel(data);
}
