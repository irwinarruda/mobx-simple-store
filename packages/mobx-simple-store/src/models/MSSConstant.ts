import { SetObservableParams } from "@utils-types/SetObservableParams";

export class MSSConstant {
  public static isConstant(value: any): value is MSSConstant {
    return value instanceof MSSConstant;
  }

  public static setObservable({
    observableData,
    name,
    initialValue,
  }: SetObservableParams<MSSConstant>) {
    observableData[name] = initialValue;
  }

  public static setObservableOptions(observableOptions: any, name: string) {
    observableOptions[name] = false;
  }
}
