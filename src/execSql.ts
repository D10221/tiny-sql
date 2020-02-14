import { addParams, TediousParameter } from "./params";
import { ColumnValue, Connection, Request } from "tedious";
/** */
export type Result<T extends { [key in keyof T]: T[key] } = {}> = {
  values: T[];
  rowCount: number;
  rows: any[];
};
/** */
export type ExecParams = TediousParameter[] | {};
/** */
export type ExecSql = <T>(
  sqlTxt: string,
  args?: ExecParams,
) => (connection: Connection) => Promise<Result<T>>;
/**
 *
 */
const execSql: ExecSql = (sqlTxt, args) => connection =>
  new Promise<Result<any>>(async (resolve, reject) => {
    const values: any[] = [];
    /**
     * [key, value]
     */
    let value: [string | number, any] = ["", undefined];

    const request = new Request(sqlTxt, (error, rowCount, rows) => {
      if (error) {
        reject(error);
      } else {
        request.removeAllListeners();
        return resolve({
          values,
          rowCount,
          rows,
          ...{ [value[0]]: value[1] },
        });
      }
    });
    request.on("row", (columns: ColumnValue[]) => {
      values.push(
        columns.reduce((out, next, i) => {
          out[(next.metadata && next.metadata.colName) || i] = next.value;
          return out;
        }, {} as any),
      );
    });
    request.on("returnValue", (parameterName, value, metadata) => {
      value = [
        /*key*/ (metadata && metadata.colName) || parameterName || "value",
        /*value*/ value,
      ];
    });
    if (args) {
      addParams(request, args);
    }
    connection.execSql(request);
  });
export default execSql;
/**
 * dapper Like
 */
export const query = <T = any>(
  con: Connection,
  sql: string,
  params?: ExecParams,
) => execSql<T>(sql, params)(con);
