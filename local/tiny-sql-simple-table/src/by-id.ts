import { Connection } from "tedious";
import ExecSql from "@d10221/tiny-sql-exec-sql";
import { debugModule } from "@d10221/create-debug";
const debug = debugModule(module);
/** */
export default function ById<T>(TABLE_NAME: string) {
    /**
     * 
     */
    return async function byId(connection: Connection, id: string|number): Promise<T> {
        try {
            const execSql = ExecSql(connection);
            const result = await execSql<T>(
                `
        select top 1 * from ${TABLE_NAME} where id = @id
        `,
                { id }
            );
            return Promise.resolve(result.values[0]);
        } catch (error) {
            debug(error);
            throw error;
        }
    }
}