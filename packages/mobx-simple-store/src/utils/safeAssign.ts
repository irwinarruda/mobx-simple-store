export function safeAssign<T, A>(ob: T, a: A): T & A;
export function safeAssign<T, A, B>(ob: T, a: A, b: B): T & A & B;
export function safeAssign<T, A, B, C>(ob: T, a: A, b: B, c: C): T & A & B & C;
export function safeAssign<T, A, B, C, D>(
  ob: T,
  a: A,
  b: B,
  c: C,
  d: D
): T & A & B & C & D;
export function safeAssign<T, A, B, C, D, E>(
  ob: T,
  a: A,
  b: B,
  c: C,
  d: D,
  e: E
): T & A & B & C & D & E;
export function safeAssign<T, A, B, C, D, E, F>(
  ob: T,
  a: A,
  b: B,
  c: C,
  d: D,
  e: E,
  f: F
): T & A & B & C & D & E & F;

export function safeAssign(ob: any, ...o: any[]) {
  for (let obj of o) {
    if (typeof obj !== "undefined")
      Object.defineProperties(ob, Object.getOwnPropertyDescriptors(obj));
  }
  return ob;
}
