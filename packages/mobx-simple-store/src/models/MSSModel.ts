import { action, computed, flow, makeObservable, observable } from "mobx";

import { hiddenKey } from "@utils/hiddenKey";
import { safeAssign } from "@utils/safeAssign";
import { isGenerator } from "@utils/isGenerator";
import { isNullOrUndefined } from "@utils/isNullOrUndefined";
import { mssError } from "@utils/mssError";
import { joinPaths } from "@utils/joinPaths";

import { ParseModel } from "@utils-types/ParseModel";
import { ParseJSON } from "@utils-types/ParseJSON";
import { SetObservableParams } from "@utils-types/SetObservableParams";

import { MSSMaybeNull } from "./MSSMaybeNull";
import { MSSArray } from "./MSSArray";
import { MSSConstant } from "./MSSConstant";

export class MSSModel<
  Observables extends object,
  Views extends object,
  Actions extends object
> {
  private currentObservables: Observables;
  private currentViews: Views;
  private currentActions: Actions;

  constructor(
    initialObservables: Observables,
    initialViews?: Views,
    initialActions?: Actions
  ) {
    this.currentObservables = initialObservables;
    this.currentViews = initialViews || ({} as Views);
    this.currentActions = {
      ...initialActions,
      _hydrate(data: any) {
        // Maybe change this to a more optimal way if there is problem with rendering
        for (const key of Object.keys(initialObservables as any)) {
          // since I'm setting every value, the low order _hydrate will allways be called
          (this as any)[key] = data[key];
        }
      },
    } as unknown as Actions;
  }

  public actions<T>(actionsList: T & ThisType<ParseModel<this>>) {
    this.currentActions = { ...this.currentActions, ...actionsList };
    return this as unknown as MSSModel<Observables, Views, Actions & T>;
  }

  public views<T>(viewsList: T & ThisType<ParseModel<this>>) {
    this.currentViews = safeAssign(this.currentViews, viewsList);
    return this as unknown as MSSModel<Observables, Views & T, Actions>;
  }

  public create(
    initialData: ParseJSON<this>,
    currentPath = ""
  ): ParseModel<this> {
    const observableData = {} as any;
    const observableOptions = {} as any;
    for (const [name, instance] of Object.entries<any>(
      this.currentObservables as Record<string, any>
    )) {
      if (MSSMaybeNull.isMaybeNull(instance)) {
        if (MSSModel.isModel(instance.child)) {
          MSSModel.setObservable({
            observableData,
            name,
            instance: instance.child,
            initialValue: (initialData as any)[name],
            isNullable: true,
            currentPath,
          });
          MSSModel.setObservableOptions(observableOptions, name);
        } else if (MSSArray.isArray(instance.child)) {
          MSSArray.setObservable({
            observableData,
            name,
            instance: instance.child,
            initialValue: (initialData as any)[name],
            isNullable: true,
            currentPath,
          });
          MSSArray.setObservableOptions(observableOptions, name);
        } else if (MSSConstant.isConstant(instance.child)) {
          MSSConstant.setObservable({
            observableData,
            name,
            initialValue: (initialData as any)[name],
          });
          MSSConstant.setObservableOptions(observableOptions, name);
        } else {
          observableData[name] = (initialData as any)[name];
          observableOptions[name] = observable;
        }
      } else {
        if (isNullOrUndefined((initialData as any)[name])) {
          mssError({
            message: `Missing data for property "${name}"`,
            currentPath,
            type: "warn",
          });
        }
        if (MSSModel.isModel(instance)) {
          MSSModel.setObservable({
            observableData,
            name,
            instance: instance,
            initialValue: (initialData as any)[name],
            currentPath,
          });
          MSSModel.setObservableOptions(observableOptions, name);
        } else if (MSSArray.isArray(instance)) {
          MSSArray.setObservable({
            observableData,
            name,
            instance: instance,
            initialValue: (initialData as any)[name],
            currentPath,
          });
          MSSArray.setObservableOptions(observableOptions, name);
        } else if (MSSConstant.isConstant(instance)) {
          MSSConstant.setObservable({
            observableData,
            name,
            initialValue: (initialData as any)[name],
          });
          MSSConstant.setObservableOptions(observableOptions, name);
        } else {
          observableData[name] = (initialData as any)[name];
          observableOptions[name] = observable;
        }
      }
    }

    for (const key of Object.keys(this.currentActions as Record<string, any>)) {
      observableData[key] = this.currentActions[key as keyof Actions];
      if (isGenerator(this.currentActions[key as keyof Actions])) {
        observableOptions[key] = flow;
      } else {
        observableOptions[key] = action;
      }
    }

    Object.defineProperties(
      observableData,
      Object.getOwnPropertyDescriptors(this.currentViews)
    );
    for (const key of Object.keys(this.currentViews as Record<string, any>)) {
      observableOptions[key] = computed;
    }

    return makeObservable(observableData, observableOptions);
  }

  public getProperties() {
    return {
      observables: this.currentObservables,
      actions: this.currentActions,
      views: this.currentViews,
    };
  }

  public static isModel(value: any) {
    return value instanceof MSSModel;
  }

  public static setObservable({
    observableData,
    name,
    instance,
    initialValue,
    isNullable = false,
    currentPath = "",
  }: SetObservableParams<MSSModel<any, any, any>>) {
    const path = joinPaths(currentPath, name);
    if (!isNullable) {
      observableData[hiddenKey(name)] = instance!.create(initialValue, path);
      Object.defineProperty(observableData, name, {
        set(updatedData) {
          if (isNullOrUndefined(updatedData)) {
            mssError({
              message:
                "Cannot set undefined data. Try wrapping the model with types.maybeNull",
            });
          }
          this[hiddenKey(name)]._hydrate(updatedData);
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
              this[hiddenKey(name)]._hydrate(updatedData);
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
