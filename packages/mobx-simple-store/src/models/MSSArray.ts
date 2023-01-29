import { observable } from "mobx";

import { hiddenKey } from "@utils/hiddenKey";
import { isNullOrUndefined } from "@utils/isNullOrUndefined";

import { SetObservableParams } from "@utils-types/SetObservableParams";

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
      throw {
        message:
          "MSSArray cannot have a child of type MSSMaybeNull that has a child of type MSSMaybeNull or MSSArray",
      };
    }
    if (MSSArray.isArray(child)) {
      throw { message: "MSSArray cannot have a child of type MSSArray" };
    }
  }

  create(initialData: Child[]) {
    if (
      MSSModel.isModel(this.child) ||
      MSSMaybeNull.isMaybeNullWithModel(this.child)
    ) {
      return new Proxy<Child[]>(
        observable.array(this.parseReadablesToModels(initialData), {
          deep: false,
        }),
        {
          get: (target: any, prop) => {
            if (prop === "replace") {
              return (value: any[]) =>
                target.replace(this.parseReadablesToModels(value));
            }
            if (prop === "unshift") {
              return (...value: any) =>
                target.unshift(...this.parseReadablesToModels(value));
            }
            if (prop === "push") {
              return (...value: any) =>
                target.push(...this.parseReadablesToModels(value));
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
                  ...this.parseReadablesToModels(value)
                );
            }
            return target[prop];
          },
          set: (target: any, prop, value) => {
            if (target[prop]) {
              target[prop].replace(value);
            } else {
              target[prop] = (this.child as MSSArray<any>).create(
                this.parseReadablesToModels(value)
              );
            }
            return value;
          },
        }
      );
    }
    return observable.array(initialData, { deep: false });
  }

  public static isArray(value: any) {
    return value instanceof MSSArray;
  }

  public parseReadablesToModels(readables: any[]) {
    let instance =
      (this.child as MSSMaybeNull<MSSModel<any, any, any>>).child ||
      (this.child as MSSModel<any, any, any>);
    let observableValues = [];
    for (let readable of readables) {
      if (isNullOrUndefined(readable)) {
        observableValues.push(undefined);
      } else {
        observableValues.push(instance.create(readable));
      }
    }
    return observableValues;
  }

  public static setObservable({
    observableData,
    name,
    instance,
    initialValue,
    isNullable = false,
  }: SetObservableParams<MSSArray<any>>) {
    if (!isNullable) {
      observableData[hiddenKey(name)] = instance.create(initialValue);
      Object.defineProperty(observableData, name, {
        set(updatedData) {
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
        observableData[hiddenKey(name)] = instance.create(initialValue);
      }
      Object.defineProperty(observableData, name, {
        set(updatedData) {
          if (isNullOrUndefined(updatedData)) {
            this[hiddenKey(name)] = undefined;
          } else {
            if (isNullOrUndefined(this[hiddenKey(name)])) {
              this[hiddenKey(name)] = instance.create(updatedData);
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
