import { types, ParseJSON } from "../src";

const model = types.model({
  bar: types.model({ baz: types.string }),
  foo1: types.array(types.string),
  foo2: types.array(types.number),
  foo3: types.array(types.boolean),
  foo4: types.array(types.model({ baz: types.string })),
});

function createModelData(initial?: Partial<ParseJSON<typeof model>>) {
  return {
    bar: { baz: "baz" },
    foo1: ["foo1"],
    foo2: [1],
    foo3: [true],
    foo4: [{ baz: "baz" }],
  };
}

describe("toJS", () => {
  test("toJS must be defined in types.model.create(), the root", () => {
    const store = types.model({}).create({});
    expect(store).toHaveProperty("toJS");
  });
  test("toJS must be defined in root's child types.model'", () => {
    const store = model.create({
      bar: { baz: "baz" },
      foo1: ["foo1"],
      foo2: [1],
      foo3: [true],
      foo4: [{ baz: "baz" }],
    });
    expect(store.bar).toHaveProperty("toJS");
  });
});
