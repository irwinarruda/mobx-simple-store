export function isGenerator(func: any) {
  return (
    !!func && !!func.prototype && typeof func.prototype.next === "function"
  );
}
