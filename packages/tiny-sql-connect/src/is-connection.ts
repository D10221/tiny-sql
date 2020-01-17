import { Connection } from "tedious";
export const isConnection = (x: any): x is Connection => {
  return x instanceof Connection;
};
