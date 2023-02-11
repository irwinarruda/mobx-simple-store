export class MSSFrozen<Child> {
  public static isFrozen(value: any) {
    return value instanceof MSSFrozen;
  }
}
