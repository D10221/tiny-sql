import { getParams, TediousParameter } from "./params";
import { ColumnValue, Connection, Request } from "tedious";
import Debug from "debug";
const debug = Debug("@d10221/tiny-sql/execSql");
/** */
export type Result<T extends { [key in keyof T]: T[key] } = {}> = {
  values: T[];
  rowCount: number;
  rows: any[];
};
/** */
export type ExecParams = TediousParameter[] | {}[] | {};
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
    debug("query: \n" + sqlTxt);

    const values: any[] = [];
    /**
     * [key, value]
     */
    let value: [string | number, any];

    const request = new Request(sqlTxt, (error, rowCount, rows) => {
      if (error) {
        reject(error);
      } else {
        request.removeAllListeners();
        if (value) {
          return resolve({
            // if value return value as T as values[0]
            values: value ? [{ [value[0]]: value[1] }, ...values] : values,
            rowCount,
            rows,
          });
        } else {
          return resolve({
            values,
            rowCount,
            rows,
          });
        }
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
    const params = getParams(args as any);
    if (params && params.length > 0) {
      for (const p of params) {
        const { name, type, value, options } = p;
        request.addParameter(name, type, value, options);
      }
    }
    connection.execSql(request);
  });
export default execSql;
