import { Connection, ConnectionConfig } from "tedious";
import { isConnection } from "./is-connection";
/** */
export default function connect(args: ConnectionConfig | Connection) {
  /** */
  const connection = isConnection(args) ? args : new Connection(args);
  /** */
  return new Promise<Connection>((resolve, reject) => {
    try {
      connection.on("connect", error => {
        if (error) return reject(error);
        return resolve(connection);
      });
      connection.on("error", error => {
        return reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}
