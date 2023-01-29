export type SetObservableParams<T> = {
  observableData: any;
  name: string;
  instance: T;
  initialValue: any;
  isNullable?: boolean;
};
