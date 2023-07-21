import { types, createStore } from "mobx-simple-store";

export const Nested3 = types.model({
  count: types.number,
});

export const Nested2 = types.model({
  count: types.number,
  nested3: Nested3,
});

export const Nested = types.model({
  count: types.number,
  nested2: Nested2,
});

export const Test = types.model({
  nested: types.array(Nested),
});

const getRoot = createStore({
  model: Test,
  initialData: {
    nested: [
      {
        count: 0,
        nested2: {
          count: 0,
          nested3: {
            count: 0,
          },
        },
      },
    ],
  },
  windowPropertyName: "testStore",
});

const store = getRoot();

store.nested = [{ count: 1, nested2: { count: 1, nested3: { count: 0 } } }];
