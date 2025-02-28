import { types } from "../src";

const model = types
  .model({
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
        .actions({ runTest() {} })
    ),
    bar3: types.optional(
      types
        .model({
          baz: types.string,
        })
        .views({
          get test() {
            return this.baz + "!";
          },
        })
        .actions({ runTest() {} })
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
            return this.baz + "!!";
          },
        })
        .actions({ runTest() {} })
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
          .actions({ runTest() {} })
      )
    ),
    foo4: types.optional(
      types.array(
        types
          .model({ baz: types.string })
          .views({
            get test() {
              return this.baz + "!";
            },
          })
          .actions({ runTest() {} })
      )
    ),
  })
  .views({
    get test() {
      return this.foo1.length;
    },
  });

function createModelData(addition?: any) {
  return {
    ...addition,
    bar1: { baz: "baz", ...addition?.bar1 },
    bar2: { baz: "baz", ...addition?.bar2 },
    bar3: { baz: "bar3", ...addition?.bar3 },
    foo1: ["foo1", ...(addition?.foo1 ?? [])],
    foo2: [
      {
        baz: "baz",
        bar: { baz: true },
        ...addition?.foo2?.[0],
      },
    ],
    foo3: [{ baz: "baz", ...addition?.foo3?.[0] }],
    foo4: [{ baz: "foo4", ...addition?.foo4?.[0] }],
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
  test("toJS must be defined in types.optional's children (Model or Array)", () => {
    const store = model.create(createModelData());
    expect(store.bar3).toHaveProperty("toJS");
    expect(store.foo4).toHaveProperty("toJS");
  });
  test("toJS in the root must return the sabe object as created", () => {
    const store = model.create(createModelData());
    expect(store.toJS!()).toStrictEqual(createModelData());
  });
  test("toJS in types.array must return the sabe array as created", () => {
    const store = model.create(createModelData());
    expect(store.foo2.toJS!()).toStrictEqual(createModelData().foo2);
  });
  test("toJS in the root must return the same object as created with the includeViews option", () => {
    const modelData = createModelData({
      bar1: { test: "baz!" },
      bar2: { test: "baz!" },
      bar3: { test: "bar3!" },
      foo1: ["any"],
      foo2: [{ test: "baz!!" }],
      foo3: [{ test: "baz!" }],
      foo4: [{ test: "foo4!" }],
      test: 2,
    });
    const store = model.create(modelData);
    expect(store.toJS!({ includeViews: true })).toStrictEqual(modelData);
    expect(store.toJS!({ includeViews: false })).not.toStrictEqual(modelData);
  });
  test("toJS in types.array must return the same array as created with the includeViews option", () => {
    const modelData = createModelData({
      foo2: [{ test: "baz!!" }],
    });
    const store = model.create(modelData);
    expect(store.foo2.toJS!({ includeViews: true })).toStrictEqual(
      modelData.foo2
    );
    expect(store.foo2.toJS!({ includeViews: false })).not.toStrictEqual(
      modelData.foo2
    );
  });
});
