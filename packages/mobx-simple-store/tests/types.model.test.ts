import { hiddenKey } from "@utils/hiddenKey";
import { cast, types } from "../src";

const model = types
  .model({
    m: types
      .model({ n: types.number })
      .actions({
        change() {
          this.n = 6;
        },
      })
      .views({
        get tripple() {
          return this.n * 3;
        },
      }),
    mn: types.maybeNull(
      types
        .model({ n: types.number })
        .actions({ change() {} })
        .views({
          get quad() {
            return this.n * 4;
          },
        })
    ),
    mo: types.optional(
      types
        .model({ n: types.number })
        .actions({
          change() {
            this.n += 1;
          },
        })
        .views({
          get quint() {
            return this.n * 5;
          },
        })
    ),
    am: types.array(
      types
        .model({ n: types.number })
        .actions({ change() {} })
        .views({
          get timesSix() {
            return this.n * 6;
          },
        })
    ),
  })
  .actions({
    change() {
      this.m.n = 5;
    },
    assignNew() {
      // Must use cast because of actions
      this.m = cast({ n: 3 });
    },
    nullAssignNew() {
      this.mn = cast({ n: 3 });
    },
    optionalAssignNew() {
      this.mo = cast({ n: 3 });
    },
    arrAssignNew() {
      this.am.push({ n: 1 });
    },
    *asyncAction() {
      this.m.n = 1000;
      yield new Promise((r) => setTimeout(r, 100));
      return true;
    },
  })
  .views({
    get double() {
      return this.m.n * 2;
    },
  });

function createModelData() {
  return {
    m: {
      n: 3,
    },
    am: [],
  };
}

describe("types.model", () => {
  test("types.model must be filled up correctly after created", () => {
    expect(model).toHaveProperty("create");
    const store = model.create(createModelData());
    expect(store).toHaveProperty("m");
    // The internal value that is never used by the user
    expect(store).toHaveProperty(hiddenKey("m"));
    expect(store.m).toHaveProperty("n");
    // Primitive types do not have internal values
    expect(store.m).not.toHaveProperty(hiddenKey("n"));
  });
  test("types.model's actions and views must work", () => {
    const store = model.create(createModelData());
    expect(store.m.n).toBe(3);
    expect(store).toHaveProperty("change");
    expect(store).toHaveProperty("double");
    store.change();
    expect(store.m.n).toBe(5);
    expect(store.double).toBe(10);
  });
  test("types.model's actions and views must work even if assigned a new object", () => {
    const store = model.create(createModelData());
    expect(store.m.n).toBe(3);
    store.assignNew();
    expect(store.m).toHaveProperty("change");
    expect(store.m).toHaveProperty("tripple");
    store.m.change();
    expect(store.m.n).toBe(6);
    expect(store.m.tripple).toBe(18);
  });
  test("types.model's async actions must work", async () => {
    const store = model.create(createModelData());
    expect(await store.asyncAction()).toBeTruthy();
    expect(store.m.n).toBe(1000);
  });
  test("types.maybeNull(types.model) must work after assigned a new object", () => {
    const store = model.create(createModelData());
    expect(store.mn).toBeFalsy();
    store.nullAssignNew();
    expect(store.mn).not.toBeFalsy();
    expect(store.mn).toHaveProperty("n");
    expect(store.mn).toHaveProperty("change");
    expect(store.mn).toHaveProperty("quad");
    expect(store.mn!.n).toBe(3);
  });
  test("types.optional(types.model) must work with default and be assignable", () => {
    const store = model.create(createModelData());
    expect(store.mo).toBeFalsy();
    store.optionalAssignNew();
    expect(store.mo).not.toBeFalsy();
    expect(store.mo).toHaveProperty("n");
    expect(store.mo).toHaveProperty("change");
    expect(store.mo).toHaveProperty("quint");
    expect(store.mo!.n).toBe(3);
  });
  test("types.array(types.model) must work after pushed a new object", () => {
    const store = model.create(createModelData());
    expect(store.am).toHaveLength(0);
    store.arrAssignNew();
    expect(store.am).toHaveLength(1);
    expect(store.am[0]).toHaveProperty("n");
    expect(store.am[0]).toHaveProperty("change");
    expect(store.am[0]).toHaveProperty("timesSix");
    expect(store.am[0].n).toBe(1);
  });
});
