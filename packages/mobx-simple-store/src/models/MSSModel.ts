import { action, computed, flow, makeObservable, observable } from "mobx";

import { hiddenKey } from "@utils/hiddenKey";
import { safeAssign } from "@utils/safeAssign";
import { isGenerator } from "@utils/isGenerator";
import { isNullOrUndefined } from "@utils/isNullOrUndefined";

import { ParseActions } from "@utils-types/ParseActions";
import { ParseObservables } from "@utils-types/ParseObservables";
import { SetObservableParams } from "@utils-types/SetObservableParams";

import { MSSMaybeNull } from "./MSSMaybeNull";
import { MSSArray } from "./MSSArray";

export class MSSModel<
  Observables extends Record<string, any>,
  Views extends Record<string, any>,
  Actions extends Record<string, any>
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
      hydrate(data: any) {
        // Maybe change this to a more optimal way if there is problem with rendering
        for (let key of Object.keys(initialObservables as any)) {
          // since I'm setting every value, the low order hydrate will allways be called
          (this as any)[key] = data[key];
        }
      },
      ...initialActions,
    } as unknown as Actions;
  }

  public actions<T extends Record<string, any>>(
    actionsList: T &
      ThisType<ParseObservables<Observables> & Views & ParseActions<Actions>>
  ) {
    this.currentActions = { ...this.currentActions, ...actionsList };
    return this as unknown as MSSModel<Observables, Views, Actions & T>;
  }

  public views<T extends Record<string, any>>(
    viewsList: T &
      ThisType<ParseObservables<Observables> & Views & ParseActions<Actions>>
  ) {
    this.currentViews = safeAssign(this.currentViews, viewsList);
    return this as unknown as MSSModel<Observables, Views & T, Actions>;
  }

  public create(
    initialData: ParseObservables<Observables>
  ): ParseObservables<Observables> & Views & Actions {
    const observableData = {} as any;
    const observableOptions = {} as any;
    for (let [name, instance] of Object.entries<any>(
      this.currentObservables as Observables
    )) {
      if (MSSMaybeNull.isMaybeNull(instance)) {
        if (MSSModel.isModel(instance.child)) {
          MSSModel.setObservable({
            observableData,
            name,
            instance: instance.child,
            initialValue: initialData[name],
            isNullable: true,
          });
          MSSModel.setObservableOptions(observableOptions, name);
        } else if (MSSArray.isArray(instance.child)) {
          MSSArray.setObservable({
            observableData,
            name,
            instance: instance.child,
            initialValue: initialData[name],
            isNullable: true,
          });
          MSSArray.setObservableOptions(observableOptions, name);
        } else {
          observableData[name] = initialData[name];
          observableOptions[name] = observable;
        }
      } else {
        if (isNullOrUndefined(initialData[name])) {
          throw { message: `Missing initial data for ${name}` };
        }
        if (MSSModel.isModel(instance)) {
          MSSModel.setObservable({
            observableData,
            name,
            instance: instance,
            initialValue: initialData[name],
          });
          MSSModel.setObservableOptions(observableOptions, name);
        } else if (MSSArray.isArray(instance)) {
          MSSArray.setObservable({
            observableData,
            name,
            instance: instance,
            initialValue: initialData[name],
          });
          MSSArray.setObservableOptions(observableOptions, name);
        } else {
          observableData[name] = initialData[name];
          observableOptions[name] = observable;
        }
      }
    }

    for (let key of Object.keys(this.currentActions)) {
      observableData[key] = this.currentActions[key];
      if (isGenerator(this.currentActions[key])) {
        observableOptions[key] = flow;
      } else {
        observableOptions[key] = action;
      }
    }

    Object.defineProperties(
      observableData,
      Object.getOwnPropertyDescriptors(this.currentViews)
    );
    for (let key of Object.keys(this.currentViews)) {
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
  }: SetObservableParams<MSSModel<any, any, any>>) {
    if (!isNullable) {
      observableData[hiddenKey(name)] = instance.create(initialValue);
      Object.defineProperty(observableData, name, {
        set(updatedData) {
          if (isNullOrUndefined(updatedData)) {
            throw {
              message: `Cannot sett undefined data. Try wrapping the model with types.maybeNull`,
            };
          }
          this[hiddenKey(name)].hydrate(updatedData);
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
              this[hiddenKey(name)].hydrate(updatedData);
            }
          }
        },
        get() {
          return this[hiddenKey(name)];
        },
      });
    }
  }

  public static setObservableOptions(observableOptions: any, key: string) {
    observableOptions[key] = false;
    observableOptions[hiddenKey(key)] = observable;
  }
}
