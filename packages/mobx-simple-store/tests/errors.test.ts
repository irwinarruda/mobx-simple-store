import { types } from "../src";

describe("errors", () => {
  test("types.model cannot be created with a non optional type with null initial value", () => {
    expect(() => {
      types.model({ a: types.string }).create({} as any);
    }).toThrow('Missing data for property "a"');
    expect(() => {
      types.model({ a: types.string }).create({ a: null } as any);
    }).toThrow('Missing data for property "a"');
  });
  test("types.model cannot allow non optional values to be assigned to null", () => {
    const store = types
      .model({
        a: types.string,
        b: types.model({}),
        c: types.array(types.string),
      })
      .create({ a: "a", b: {}, c: ["c"] });
    expect(() => {
      store.a = null as any;
    }).not.toThrow();
    expect(() => {
      store.b = null as any;
    }).toThrow(
      "Cannot set undefined data. Try wrapping the model with types.optional or types.maybeNull"
    );
    expect(() => {
      store.c = null as any;
    }).toThrow(
      "Cannot set undefined data. Try wrapping the model with types.optional or types.maybeNull"
    );
  });
  test("types.array should be validated with it's rules", () => {
    expect(() => {
      types.model({ a: types.array(types.string) });
    }).not.toThrow();
    expect(() => {
      types.model({ a: types.array(types.array(types.boolean)) });
    }).toThrow("types.array cannot have a child types.array");
    expect(() => {
      types.model({
        a: types.array(types.maybeNull(types.array(types.boolean))),
      });
    }).toThrow(
      "types.array cannot have a child types.maybeNull that has a child types.maybeNull or types.array"
    );
    expect(() => {
      types.model({
        a: types.array(types.optional(types.array(types.boolean))),
      });
    }).toThrow(
      "types.array cannot have a child types.optional that has a child types.optional or types.array"
    );
    expect(() => {
      types.model({
        a: types.array(types.optional(types.optional(types.boolean))),
      });
    }).toThrow(
      "types.array cannot have a child types.optional that has a child types.optional or types.array"
    );
    expect(() => {
      types.model({
        a: types.array(types.maybeNull(types.maybeNull(types.boolean))),
      });
    }).toThrow(
      "types.array cannot have a child types.maybeNull that has a child types.maybeNull or types.array"
    );
  });
});
