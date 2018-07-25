import { Connection } from "tedious";
import ExecSql from "@australis/tiny-sql-exec-sql";
import { debugModule } from "@australis/create-debug";
const debug = debugModule(module);
/**
 * 
 */
export default function FindBy<T>(TABLE_NAME: string) {
    /**
     * 
     */
    return async function findBy(
        connection: Connection,
        params: Partial<T>
    ): Promise<T[]> {
        try {
            const execSql = ExecSql(connection);
            const query = `/*find-by*/
    select * from ${TABLE_NAME} 
      where ${Object.keys(params)
                    .map(key => ` ${key} = @${key}`)
                    .join(" AND ")};
    /*find-by*/`;
            debug(query);
            const r = await execSql<T>(query, params);
            if (r.error) {
                return Promise.reject(r.error);
            }
            return Promise.resolve(r.values);
        } catch (error) {
            debug(error);
            throw error;
        }
    }
}