import { MSSModel } from "@models/MSSModel";
import { ParseJSON } from "@utils-types/ParseJSON";
import { ParseModel } from "@utils-types/ParseModel";

export type CreateStoreParams<T extends MSSModel<any, any, any>> = {
  model: T;
  initialData: ParseJSON<T>;
  windowPropertyName?: string;
};

export function createStore<T extends MSSModel<any, any, any>>({
  model,
  initialData,
  windowPropertyName,
}: CreateStoreParams<T>): () => ParseModel<T> {
  let _store: ParseModel<T>;
  return () => {
    if (!_store) {
      _store = model.create(initialData, windowPropertyName || ".");
      if (windowPropertyName && typeof window !== "undefined") {
        (window as any)[windowPropertyName] = _store;
      }
    }
    return _store;
  };
}
