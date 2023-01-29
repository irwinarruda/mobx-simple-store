export function safeAssign(ob: any, ...o: any[]) {
  for (let obj of o) {
    if (typeof obj !== 'undefined')
      Object.defineProperties(ob, Object.getOwnPropertyDescriptors(obj));
  }
  return ob;
}
