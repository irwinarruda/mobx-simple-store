import { types } from "../src";

const model = types
  .model({
    a: types.array(types.string),
    am: types.array(types.maybeNull(types.model({ n: types.number }))),
    amn: types.maybeNull(types.array(types.string)),
  })
  .actions({
    setA() {
      this.a.push("a");
      this.a.push("b");
      this.a.push("c");
    },
    setAm() {
      this.am.push({ n: 1 });
      this.am.push(undefined);
      this.am.push({ n: 3 });
    },
    setAmn() {
      this.amn = [];
      this.amn.push("a");
      this.amn.push("b");
    },
  });

describe("types.array", () => {
  test("types.array of primitive values must work", () => {
    const store = model.create({
      a: [],
      am: [],
    });
    expect(store.a).toStrictEqual([]);
    store.setA();
    expect(store.a).toStrictEqual(["a", "b", "c"]);
  });
  test("types.array of maybeNull must work", () => {
    const store = model.create({
      a: [],
      am: [],
    });
    expect(store.am).toStrictEqual([]);
    store.setAm();
    expect(store.am).toStrictEqual([{ n: 1 }, undefined, { n: 3 }]);
  });
  test("types.maybeNull(types.array) must work even after assgned a new value", () => {
    const store = model.create({
      a: [],
      am: [],
    });
    expect(store.amn).toBe(undefined);
    store.setAmn();
    expect(store.amn).toStrictEqual(["a", "b"]);
  });
});
