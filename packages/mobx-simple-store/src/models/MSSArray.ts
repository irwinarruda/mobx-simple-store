import { observable } from "mobx";

import { SetObservableParams } from "@utils-types/SetObservableParams";
import { hiddenKey } from "@utils/hiddenKey";
import { isNullOrUndefined } from "@utils/isNullOrUndefined";
import { joinPaths } from "@utils/joinPaths";
import { mssError } from "@utils/mssError";
import { MSSMaybeNull } from "./MSSMaybeNull";
import { MSSModel } from "./MSSModel";

export class MSSArray<Child> {
  public child: Child;
  constructor(child: Child) {
    this.validateChild(child);
    this.child = child;
  }

  public validateChild(child: Child) {
    if (
      MSSMaybeNull.isMaybeNullWithArray(child) ||
      MSSMaybeNull.isMaybeNullWithMaybeNull(child)
    ) {
      mssError({
        message:
          "types.array cannot have a child types.maybeNull that has a child types.maybeNull or types.array",
      });
    }
    if (MSSArray.isArray(child)) {
      mssError({ message: "types.array cannot have a child types.array" });
    }
  }

  create(initialData: Child[], currentPath = "") {
    if (
      MSSModel.isModel(this.child) ||
      MSSMaybeNull.isMaybeNullWithModel(this.child)
    ) {
      return this.createProxiedModelArray(initialData, currentPath);
    }
    return Object.defineProperty(
      observable.array(initialData, { deep: false }),
      "toJS",
      {
        value() {
          const arr = [];
          for (let item of this) arr.push(item);
          return arr;
        },
      },
    );
  }

  public createProxiedModelArray(initialData: any[], currentPath: string) {
    return new Proxy<any[]>(
      observable.array(this.parseReadablesToModels(initialData, currentPath), {
        deep: false,
      }),
      {
        get: (target: any, prop) => {
          if (prop === "toJS") {
            return (args: any) => {
              const arr = [];
              for (let item of target)
                arr.push(
                  !isNullOrUndefined(item?.toJS) ? item.toJS(args) : item,
                );
              return arr;
            };
          }
          if (prop === "replace") {
            return (value: any[]) =>
              target.replace(this.parseReadablesToModels(value, currentPath));
          }
          if (prop === "unshift") {
            return (...value: any) =>
              target.unshift(
                ...this.parseReadablesToModels(value, currentPath),
              );
          }
          if (prop === "push") {
            return (...value: any) =>
              target.push(...this.parseReadablesToModels(value, currentPath));
          }
          if (prop === "splice") {
            return (
              start: number,
              deleteCount?: number | undefined,
              ...value: any
            ) =>
              target.splice(
                start,
                deleteCount,
                ...this.parseReadablesToModels(value, currentPath),
              );
          }
          return target[prop];
        },
        set: (target: any, prop, value) => {
          if (!isNullOrUndefined(target[prop])) {
            target[prop]._hydrate(value);
          } else {
            target[prop] = (this.child as MSSModel<any, any, any>).create(
              value,
              currentPath,
            );
          }
          return value;
        },
      },
    );
  }

  public parseReadablesToModels(readables: any[], currentPath: string) {
    let instance = ((this.child as any).child ?? this.child) as MSSModel<
      any,
      any,
      any
    >;
    let observableValues = [];
    for (let index in readables) {
      if (isNullOrUndefined(readables[index])) {
        observableValues.push(undefined);
      } else {
        observableValues.push(
          instance.create(readables[index], joinPaths(currentPath, index)),
        );
      }
    }
    return observableValues;
  }

  public static isArray(value: any) {
    return value instanceof MSSArray;
  }

  public static setObservable({
    observableData,
    name,
    instance,
    initialValue,
    isNullable = false,
    currentPath = "",
  }: SetObservableParams<MSSArray<any>>) {
    const path = joinPaths(currentPath, name);
    if (!isNullable) {
      observableData[hiddenKey(name)] = instance!.create(initialValue, path);
      Object.defineProperty(observableData, name, {
        set(updatedData) {
          if (isNullOrUndefined(updatedData)) {
            mssError({
              message: `Cannot set undefined data. Try wrapping the model with types.maybeNull`,
            });
          }
          this[hiddenKey(name)].replace(updatedData);
        },
        get() {
          return this[hiddenKey(name)];
        },
      });
    } else {
      if (isNullOrUndefined(initialValue)) {
        observableData[hiddenKey(name)] = undefined;
      } else {
        observableData[hiddenKey(name)] = instance!.create(initialValue, path);
      }
      Object.defineProperty(observableData, name, {
        set(updatedData) {
          if (isNullOrUndefined(updatedData)) {
            this[hiddenKey(name)] = undefined;
          } else {
            if (isNullOrUndefined(this[hiddenKey(name)])) {
              this[hiddenKey(name)] = instance!.create(updatedData, path);
            } else {
              this[hiddenKey(name)].replace(updatedData);
            }
          }
        },
        get() {
          return this[hiddenKey(name)];
        },
      });
    }
  }

  public static setObservableOptions(observableOptions: any, name: string) {
    observableOptions[name] = false;
    observableOptions[hiddenKey(name)] = observable;
  }
}
