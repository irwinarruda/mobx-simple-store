import { MSSArray } from "./MSSArray";
import { MSSModel } from "./MSSModel";

export class MSSOptional<Child, IncludeNull extends boolean> {
  public child: Child;
  public includeNull: IncludeNull;
  constructor(child: Child, includeNull: IncludeNull) {
    this.child = child;
    this.includeNull = includeNull;
  }

  public static isOptional(value: any): value is MSSOptional<any, any> {
    return value instanceof MSSOptional;
  }

  public static isOptionalWithArray(
    value: any
  ): value is MSSOptional<MSSArray<any>, any> {
    return this.isOptional(value) && MSSArray.isArray(value.child);
  }

  public static isOptionalWithModel(
    value: any
  ): value is MSSOptional<MSSModel<any, any, any>, any> {
    return this.isOptional(value) && MSSModel.isModel(value.child);
  }

  public static isOptionalWithOptional(
    value: any
  ): value is MSSOptional<MSSOptional<any, any>, any> {
    return this.isOptional(value) && this.isOptional(value.child);
  }
}
