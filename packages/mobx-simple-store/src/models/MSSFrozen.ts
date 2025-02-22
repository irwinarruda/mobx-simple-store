export class MSSFrozen {
  public static isFrozen(value: any): value is MSSFrozen {
    return value instanceof MSSFrozen;
  }
}
