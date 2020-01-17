import connect from "@d10221/tiny-sql-connect";
import { Connection } from "tedious";
import sqlConnectionConfig from "@d10221/tiny-sql-connection-config";
/**
 * connect to server, not db
 */
export default function connectToSqlEngine(envKey = "DB"): Promise<Connection> {
  const { options, ...engineConfig } = sqlConnectionConfig(envKey);
  return connect({ ...engineConfig, options: { encrypt: !!options.encrypt } });
}
