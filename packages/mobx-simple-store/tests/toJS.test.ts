import { types, ParseJSON } from "../src";

const model = types.model({
  bar1: types
    .model({ baz: types.string })
    .views({
      get test() {
        return this.baz + "!";
      },
    })
    .actions({ runTest() {} }),
  bar2: types.maybeNull(
    types
      .model({ baz: types.string })
      .views({
        get test() {
          return this.baz + "!";
        },
      })
      .actions({ runTest() {} }),
  ),
  foo1: types.array(types.string),
  foo2: types.array(
    types
      .model({
        baz: types.string,
        bar: types.model({ baz: types.boolean }).actions({ test() {} }),
      })
      .views({
        get test() {
          return this.baz + "!";
        },
      })
      .actions({ runTest() {} }),
  ),
  foo3: types.maybeNull(
    types.array(
      types
        .model({ baz: types.string })
        .views({
          get test() {
            return this.baz + "!";
          },
        })
        .actions({ runTest() {} }),
    ),
  ),
});

function createModelData(
  initial?: Partial<ParseJSON<typeof model>>,
): ParseJSON<typeof model> {
  return {
    ...initial,
    bar1: { baz: "baz" },
    bar2: { baz: "baz" },
    foo1: ["foo1"],
    foo2: [{ baz: "baz", bar: { baz: true } }],
    foo3: [{ baz: "baz" }],
  };
}

describe("toJS", () => {
  test("toJS must be defined in types.model.create(), the root", () => {
    const store = types.model({}).create({});
    expect(store).toHaveProperty("toJS");
  });
  test("toJS must be defined in types.model", () => {
    const store = model.create(createModelData());
    expect(store.bar1).toHaveProperty("toJS");
  });
  test("toJS must be defined in types.array", () => {
    const store = model.create(createModelData());
    expect(store.foo1).toHaveProperty("toJS");
    expect(store.foo2).toHaveProperty("toJS");
  });
  test("toJS must be defined in types.array's children (Model)", () => {
    const store = model.create(createModelData());
    expect(store.foo2[0]).toHaveProperty("toJS");
  });
  test("toJS must be defined in types.maybeNull's children (Array or Model)", () => {
    const store = model.create(createModelData());
    expect(store.bar2).toHaveProperty("toJS");
    expect(store.foo3).toHaveProperty("toJS");
  });
  test("toJS in the root must return the sabe object as created", () => {
    const store = model.create(createModelData());
    expect(store.toJS()).toStrictEqual(createModelData());
  });
  test("toJS in the root.foo2 must return the sabe object as created", () => {
    const store = model.create(createModelData());
    expect(store.foo2.toJS!()).toStrictEqual(createModelData().foo2);
  });
});
