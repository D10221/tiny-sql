import { debugModule } from "@d10221/create-debug";
import { Exec } from "@d10221/tiny-sql-exec-sql";
import { Connection } from "tedious";
const debug = debugModule(module);
/** */
export default <T>(tableName: string) => () => async (connection: Connection) => {
  try {    
    const result = await Exec<T>(`select * from ${tableName}`)(connection).then(x => x.values);
    return result;
  } catch (error) {
    debug(error);
    throw error;
  }
}
