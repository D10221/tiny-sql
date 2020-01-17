import { Connection } from "tedious";
import ExecSql from "@d10221/tiny-sql-exec-sql";
import { debugModule } from "@d10221/create-debug";
const debug = debugModule(module);
/** */
export default function Remove(TABLE_NAME: string){
    /**
     * 
     */
    return async function remove(connection: Connection, id: string | number) {
        try {
          const r = await ExecSql(connection)(
            `DELETE ${TABLE_NAME} where id = @id`,
            { id }
          );
          if (r.error) return Promise.reject(r.error);
          return Promise.resolve(r);
        } catch (error) {
          debug(error);
          return Promise.reject(error);
        }
      }
}