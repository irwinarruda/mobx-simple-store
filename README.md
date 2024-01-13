# <img src="./assets/mss-logo.svg" height="50pd" align="center" /> Mobx Simple Store

[![npm version](https://badge.fury.io/js/mobx-simple-store.svg)](https://badge.fury.io/js/mobx-simple-store)

Mobx Simple Store (also MSS) is a wrapper around Mobx designed to create a reactive state tree store with an opinionated structure and setters that can read JSON objects.

## Mobx Simple Store vs Mobx State Tree

As a heavy user of [Mobx State Tree (MST)](https://mobx-state-tree.js.org/intro/welcome), I loved using it. The State Tree along with the `types.model` structure boosted my productivity a lot. One of the only problems with **MST** is its low performance when handling large datasets. These are described at https://github.com/mobxjs/mobx-state-tree/issues/1683 and https://github.com/mobxjs/mobx-state-tree/issues/440.

It was clear that those were **MST** problems and not Mobx specific. Because of that I created **MSS** to be a close enouth alternative to **MST** but removed some of the features that cause those performance issues. Here is a list of differences between **MSS** and **MST**.

- **MSS** creates actions and views via `this` while **MST** creates them using the action binding with `self`.
- **MSS** does not have runtime type checking as **MST** does.
- **MSS** does not have snapshots or use of any reactions built into the library as **MST** does.
- **MSS** nodes don't know about parent nodes as **MST** does.

## Key features and concepts

Not all **MST** features are integrated into **MSS**. I created this library to suit my current workflow the best. Here are some core features and concepts that I used to tailor **MSS**.

### Model

Instead of needing a package like [Zod](https://zod.dev/) or to create classes to handle objects. With the `state-tree` model, it's possible to declare an object that not only has well-parsed types but is also fully reactive.

```ts
import { types, ParseJSON, ParseModel } from "mobx-simple-store";

const Car = types.model({
  // MobX Observables
  name: types.string,
  price: types.number,
  hasDiscount: types.boolean,
  saleInformation: types.maybeNull(types.string),
});

interface ICar extends ParseJSON<typeof Car> {}
/**
  Output
  interface ICar {
    name: string;
    price: number;
    hasDiscount: boolean;
    saleInformation?: string;
  }
 */
```

### Controller

Usually, **Models** don't have `actions/functions` in my workflows, but we can use the **Controller** pattern to handle them. The **Controller** is meant to control the UI.

```ts
import { types, ParseJSON, ParseModel } from "mobx-simple-store";

const CarCtrl = types
  // MobX Observables
  .model({
    cars: types.array(Car),
    loading: types.boolean,
  })
  // MobX Actions
  .actions({
    *fetchCars() {
      const cars = yield* carDataFromBackend();
      this.cars = cars;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
  });
```

### Composition

It's also possible to create `util` **Models** to compose the controller, making the code more reusable.

```ts
import { types } from "mobx-simple-store";

const Loading = types
  .model({
    loading: types.boolean,
  })
  .actions({
    setLoading(loading: boolean) {
      this.loading = loading;
    },
  });

const CarCtrl = types
  .compose(
    Loading,
    types.model({
      cars: types.array(Car),
      loading: types.boolean,
    })
  )
  .actions({
    *fetchCars() {
      try {
        this.setLoading(true);
        const cars = yield* carDataFromBackend();
        this.cars = cars;
      } catch() {} finally {
        this.setLoading(false);
      }
    },
  });
```

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
    }),
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

## TODOS

This is the list of things I want to do with this libary. I don't want to go too far because I know that mobx-state-tree is going to fix it's performance issues and it's a more popular and well maintained package.

- [ ] add unit tests for every `type`
- [x] add `types.constant`
- [x] add `types.frozen`
- [ ] add `types.enum`
- [ ] add `types.map`
- [x] add to models and types the `.toJS` method to better debugg
- [ ] add prettier and eslint to the codebase
- [ ] compatibility with mobx-state-tre via `types.frozen`
