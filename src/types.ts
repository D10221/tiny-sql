/** */
export type Result<T extends { [key in keyof T]: T[key] } = {}> = {
  values: T[];
  rowCount: number;
  rows: any[];
};
