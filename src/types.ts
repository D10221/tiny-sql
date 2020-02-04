/** */
export type Result<T extends {} & { [key: string]: any }> = {
  values?: T[];
  rowCount?: number;
  rows?: any[];
};
