export class MSSConstant<Child> {
  public static isConstant(value: any) {
    return value instanceof MSSConstant;
  }
}
