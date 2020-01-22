import { getParams, TediousParameter } from "./params";
import {
  ColumnValue,
  Connection,
  Request,
  TYPES,
} from "tedious";
import Debug from "debug";
import { Result } from "./types";
const debug = Debug("@d10221/tiny-sql-exec/exec");

// ...
export type ExecParams = TediousParameter[] | ({}[]) | {};
/**
 * 
 */
export default <T>(sqlTxt: string, args?: ExecParams) => (
  connection: Connection,
) =>
  new Promise<Result<T>>(async (resolve, reject) => {
    debug("query: \n" + sqlTxt);
    const values: T[] = [];

    let value: [any, string | undefined] = [undefined, undefined];

    const request = new Request(sqlTxt, (error, rowCount, rows) => {
      if (error) {
        return reject(error);
      }
      request.removeAllListeners();
      return resolve(Object.assign({
        values,
        rowCount,
        rows
      }, {
        [value[1] || "value"]: value[0]
      }));
    });

    request.on("row", (columns: ColumnValue[]) => {
      const row: any = {};
      columns.forEach((column, i) => {
        row[column.metadata.colName || i] = column.value;
      });
      values.push(row);
    });

    request.on(
      "returnValue",
      (parameterName, value, _metadata) => {
        value = [value, parameterName]
      },
    );

    const params = getParams(args as any);
    if (params && params.length > 0) {
      for (const p of params) {
        const { name, type, value, options } = p;
        request.addParameter(name, type, value, options);
      }
    }
    // execSql:
    connection.execSql(request);
  });
