import { observer } from "mobx-react-lite";
import { createStore, safeAssign, toGenerator, types } from "mobx-simple-store";
import { types as mstTypes } from "mobx-state-tree";
import React from "react";

import reactLogo from "./assets/react.svg";
import "./Counter.css";

async function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const CounterSubSubStore = types
  .model({
    count5: types.number,
    count6: types.number,
  })
  .views({
    get sumCount() {
      return this.count5 + this.count6;
    },
  })
  .actions({
    incrementCount5() {
      this.count5++;
    },
    incrementCount6() {
      this.count6++;
    },
  });

const CounterSubStore = types
  .model({
    count3: types.number,
    count4: types.number,
    countSub: CounterSubSubStore,
  })
  .views({
    get sumCount() {
      return this.count3 + this.count4;
    },
  })
  .actions({
    incrementCount3() {
      this.count3++;
    },
    incrementCount4() {
      this.count4++;
    },
    *asyncIncrementCount() {
      this.count3 = 5;
      yield* toGenerator(delay(3000));
      this.count3 = 10;
      return "";
    },
  })
  .actions({
    async incrementCountInfinity() {
      await this.asyncIncrementCount();
    },
  });

const CounterArrStore = types
  .model({
    count: types.number,
  })
  .actions({
    incrementCount() {
      this.count++;
    },
  });

const Loading = types.model({ loading: types.boolean }).actions({
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
      countSub: types.maybeNull(CounterSubStore),
      countArr: types.maybeNull(types.array(CounterArrStore)),
      countD: types.array(types.number),
      countE: types.array(types.model({ count: types.number })),
      anotherOne: types.model({ count: types.number }),
    })
  )
  .views({
    get filteredCountArr() {
      return this.countArr?.map((x) =>
        safeAssign(x, { alterCount: x.count * 2 })
      );
    },
    get sumCount() {
      return this.count1 + this.count2;
    },
  })
  .actions({
    incrementCount1() {
      this.countD;
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
    setData(data: any) {
      this.countSub = data;
    },
  });

const useCounterStore = createStore({
  model: CounterStore,
  initialData: {
    count1: 0,
    count2: 0,
    loading: false,
    anotherOne: { count: 123 },
    countD: [],
    countE: [],
  },
  windowPropertyName: "counterStore",
});

const counterStore = useCounterStore();
counterStore.asyncIncrementCount();
counterStore.count1;
counterStore.countSub!.countSub!.sumCount;
counterStore.countSub!.countSub!.incrementCount5();

const testPerformance = () => {
  console.time("Normal");
  counterStore.setDataArr([{ count: 1 }, { count: 2 }, { count: 3 }]);
  counterStore.setData({
    count3: 11,
    count4: 11,
    countSub: { count5: 11, count6: 11 },
  });
  console.timeEnd("Normal");
};

const MSSPerformanceTest = types
  .model({
    items: types.maybeNull(types.array(types.string)),
  })
  .actions({
    setItems(items: any[]) {
      this.items = items;
    },
  });
const MSTerformanceTest = mstTypes
  .model({
    items: mstTypes.maybeNull(mstTypes.array(mstTypes.string)),
  })
  .actions((self) => ({
    setItems(items: any[]) {
      self.items = items as any;
    },
  }));

const usePerformanceTestStore = createStore({
  model: MSSPerformanceTest,
  initialData: {
    items: undefined,
  },
  windowPropertyName: "performanceTestStore",
});
const items = Array.from(Array(1000000).keys()).map((x) => `Item ${x}`);

const mssPerformanceTestStore = usePerformanceTestStore();
const mstPerformanceTestStore = MSTerformanceTest.create({ items: undefined });
console.time("mss");
mssPerformanceTestStore.setItems(items);
console.timeEnd("mss");
console.time("mst");
mstPerformanceTestStore.setItems(items);
console.timeEnd("mst");

type CounterProps = {
  children?: React.ReactNode;
};

export const Counter1 = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Counter 1</h2>
      <div className="card">
        <p>The count is: {counterStore.count1}</p>
        <button onClick={() => counterStore.incrementCount1()}>
          Increment
        </button>
      </div>
    </>
  );
});

export const Counter2 = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Counter 2</h2>
      <div className="card">
        <p>The count is: {counterStore.count2}</p>
        <button onClick={() => counterStore.incrementCount2()}>
          Increment
        </button>
      </div>
    </>
  );
});

export const SumCounter = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Sum Counter</h2>
      <div className="card">
        <p>The count is: {counterStore.sumCount}</p>
      </div>
    </>
  );
});

export const Counter3 = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Counter 3</h2>
      <div className="card">
        <p>The count is: {counterStore.countSub!.count3}</p>
        <button onClick={() => counterStore.countSub!.incrementCount3()}>
          Increment
        </button>
      </div>
    </>
  );
});

export const Counter4 = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Counter 4</h2>
      <div className="card">
        <p>The count is: {counterStore.countSub!.count4}</p>
        <button onClick={() => counterStore.countSub!.incrementCount4()}>
          Increment
        </button>
      </div>
    </>
  );
});

export const SubSumCounter = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Sum Counter</h2>
      <div className="card">
        <p>The count is: {counterStore.countSub!.sumCount}</p>
      </div>
    </>
  );
});

export const Counter5 = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Counter 5</h2>
      <div className="card">
        <p>The count is: {counterStore.countSub!.countSub.count5}</p>
        <button
          onClick={() => counterStore.countSub!.countSub.incrementCount5()}
        >
          Increment
        </button>
      </div>
    </>
  );
});

export const Counter6 = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Counter 6</h2>
      <div className="card">
        <p>The count is: {counterStore.countSub!.countSub.count6}</p>
        <button
          onClick={() => counterStore.countSub!.countSub.incrementCount6()}
        >
          Increment
        </button>
      </div>
    </>
  );
});

export const SubSubSumCounter = observer(({}: CounterProps) => {
  return (
    <>
      <h2>Sum Counter</h2>
      <div className="card">
        <p>The count is: {counterStore.countSub!.countSub.sumCount}</p>
      </div>
    </>
  );
});

export const Counter = observer(({}: CounterProps) => {
  return (
    <div className="App">
      {counterStore.loading && <div>Loading...</div>}
      <button onClick={testPerformance}>Test Performance</button>
      <div>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      {counterStore.filteredCountArr &&
        counterStore.filteredCountArr.map((num, index) => (
          <div key={index}>
            {num.count}{" "}
            <button
              onClick={() => {
                num.incrementCount();
              }}
            >
              Increment
            </button>
            {num.alterCount}{" "}
          </div>
        ))}
      <SumCounter />
      <Counter1 />
      <Counter2 />
      {counterStore.countSub && (
        <>
          <SubSumCounter />
          <Counter3 />
          <Counter4 />
          <SubSubSumCounter />
          <Counter5 />
          <Counter6 />
        </>
      )}
    </div>
  );
});
