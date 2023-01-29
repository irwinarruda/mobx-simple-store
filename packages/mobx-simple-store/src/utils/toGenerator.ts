export function* toGenerator<T>(p: Promise<T>) {
  return (yield p) as T;
}
