import { MSSArray } from "./MSSArray";
import { MSSModel } from "./MSSModel";

export class MSSMaybeNull<Child> {
  public child: Child;
  constructor(child: Child) {
    this.child = child;
  }

  public static isMaybeNull(value: any) {
    return value instanceof MSSMaybeNull;
  }

  public static isMaybeNullWithArray(value: any) {
    return this.isMaybeNull(value) && MSSArray.isArray(value.child);
  }

  public static isMaybeNullWithModel(value: any) {
    return this.isMaybeNull(value) && MSSModel.isModel(value.child);
  }

  public static isMaybeNullWithMaybeNull(value: any) {
    return this.isMaybeNull(value) && this.isMaybeNull(value.child);
  }
}
