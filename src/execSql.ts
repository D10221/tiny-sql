import { getParams, TediousParameter } from "./params";
import { ColumnValue, Connection, Request } from "tedious";
import Debug from "debug";
import { Result } from "./types";
const debug = Debug("@d10221/tiny-sql/execSql");

export type ExecParams = TediousParameter[] | {}[] | {};

type ExecSql = <T>(
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
    let value: any = {};

    const request = new Request(sqlTxt, (error, rowCount, rows) => {
      if (error) {
        reject(error);
      } else {
        request.removeAllListeners();
        return resolve({
          values,
          rowCount,
          rows,
          ...value,
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
      value = {
        [(metadata && metadata.colName) || parameterName || "value"]: value,
      };
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
