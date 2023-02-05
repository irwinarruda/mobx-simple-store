# Mobx Simple Store

Mobx Simple Store (also MSS) is a wrapper around Mobx that helps the user create a reactive state tree store with an opinionated structure and setters that can read JSON objects.

## Mobx Simple Store vs Mobx State Tree

As heavy users of [Mobx State Tree (MST)](https://mobx-state-tree.js.org/intro/welcome), we loved using it. The State Tree along with the `types.model` structure boosted our productivity a lot. One of the only problems with **MST** is its low performance when handling large amounts of data. These are described at https://github.com/mobxjs/mobx-state-tree/issues/1683 and https://github.com/mobxjs/mobx-state-tree/issues/440.

It was clear that those were **MST** problems and not Mobx specific. Because of that we created **MSS** to be a close alternative to **MST** but removed some of the features that cause those performance issues. Here is a list of differences between **MSS** and **MST**.

- **MSS** creates actions and views via `this` while **MST** creates them using the action binding with `self`.
- **MSS** does not have runtime type checking as **MST** does.
- **MSS** does not have snapshots or use of any reactions built into the library as **MST** does.
- **MSS** nodes don't know about parent nodes as **MST** does.

## Examples

### Basic implementation

```ts
import { toGenerator, types, createStore } from "mobx-simple-store";

const Loading = types
  .model({
    loading: types.boolean,
  })
  .actions({
    setLoading(val: boolean) {
      this.loading = val;
    },
  });

const CounterStore = types
  .compose(
    Loading,
    types.model({
      count1: types.number,
      count2: types.number,
      countArr: types.maybeNull(types.array(types.string)),
    })
  )
  .views({
    get sumCount() {
      return this.count1 + this.count2;
    },
  })
  .actions({
    incrementCount1() {
      this.count1++;
    },
  })
  .actions({
    *asyncIncrementCount() {
      this.loading = true;
      this.count1 = 5;
      yield* toGenerator(delay(3000));
      this.loading = false;
      this.count1 = 10;
      return 10;
    },
    incrementCount2() {
      this.count2++;
    },
    setDataArr(data: any) {
      this.countArr = data;
    },
  });

const useCounterStore = createStore({
  model: CounterStore,
  initialData: {
    count1: 0,
    count2: 0,
    countArr: undefined,
  },
  windowPropertyName: "counterStore",
});

const counterStore = useCounterStore();
```

For more examples, check `packages/sandbox`
