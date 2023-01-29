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
    return value instanceof MSSMaybeNull && MSSArray.isArray(value.child);
  }

  public static isMaybeNullWithModel(value: any) {
    return value instanceof MSSMaybeNull && MSSModel.isModel(value.child);
  }

  public static isMaybeNullWithMaybeNull(value: any) {
    return value instanceof MSSMaybeNull && MSSModel.isModel(value.child);
  }
}
