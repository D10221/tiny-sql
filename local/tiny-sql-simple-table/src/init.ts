import { Connection } from "tedious";
import ExecSql from "@d10221/tiny-sql-exec-sql";
import { debugModule } from "@d10221/create-debug";
const debug = debugModule(module);
/**
 * 
 * @param TABLE_NAME 
 */
export default function Init(TABLE_NAME: string, dto: string, exists: (connection: Connection) => Promise<boolean>) {
    /**
     * 
     */
    return async function init(connection: Connection): Promise<boolean> {
        try {
            const execSql = ExecSql(connection);
            // ... 
            if (!(await exists(connection))) {
                await execSql(dto);
            }
            return execSql<{ ok: number }>(
                `select ok=1 from sys.tables where name = '${TABLE_NAME}'`
            ).then(x => x.values[0]["ok"] === 1);
        } catch (error) {
            debug(error);
            throw error;
        }
    }
}