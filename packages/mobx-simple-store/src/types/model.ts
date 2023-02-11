import { MSSModel } from "@models/MSSModel";

export function model<T>(data: T) {
  return new MSSModel(data);
}
