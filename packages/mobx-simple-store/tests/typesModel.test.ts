import { hiddenKey } from "@utils/hiddenKey";
import { types } from "../src";

const model = types
  .model({
    m: types.model({ n: types.number }),
  })
  .actions({
    change() {
      this.m.n = 5;
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
  test("types.model actions must change the value correctly", () => {
    const store = model.create(createModelData());
    expect(store).toHaveProperty("change");
    store.change();
    expect(store.m.n).toBe(5);
  });
  test("types.model views must return the value correctly", () => {
    const store = model.create(createModelData());
    expect(store).toHaveProperty("double");
    expect(store.double).toBe(6);
    store.change();
    expect(store.double).toBe(10);
  });
});
