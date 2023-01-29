import { MSSModel } from "@models/MSSModel";

export type CreateStoreParams<T extends MSSModel<any, any, any>> = {
  model: T;
  initialData: Parameters<T["create"]>[0];
  windowPropertyName?: string;
};

export function createStore<T extends MSSModel<any, any, any>>({
  model,
  initialData,
  windowPropertyName,
}: CreateStoreParams<T>): () => ReturnType<T["create"]> {
  let _store: ReturnType<T["create"]>;
  return () => {
    if (!_store) {
      _store = model.create(initialData);
      if (windowPropertyName && typeof window !== "undefined") {
        (window as any)[windowPropertyName] = _store;
      }
    }
    return _store;
  };
}
