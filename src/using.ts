import { Connection } from "tedious";
import Debug from "debug";
const debug = Debug("@d10221/tiny-sql-use-connection");
/** */
export default function using(getConnection: () => Promise<Connection>) {
  /** */
  return async <T>(callback: (connection: Connection) => T): Promise<T> => {
    let connection: Connection | undefined = undefined;
    try {
      connection = await getConnection();
      const r = await callback(connection);
      return Promise.resolve(r);
    } catch (e) {
      debug(e);
      return Promise.reject(e);
    } finally {
      if (connection) connection!.close();
    }
  };
}
