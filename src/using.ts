import { Connection } from "tedious";

type Task<T = any> = (connection: Connection) => Promise<T>

export default function using(getConnection: () => Promise<Connection>) {
  /** */
  return async <T>(callback: Task): Promise<T> => {
    try {
      const connection = await getConnection();
      try {
        // throws here, wait for connection to close;
        const ret = await callback(connection)
        return ret;
      } catch (error) {
        throw error;
      } finally {
        if (connection) connection!.close();
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
