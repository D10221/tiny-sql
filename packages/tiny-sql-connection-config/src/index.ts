import { ConnectionConfig } from "tedious";
import parseString from "@d10221/tiny-sql-connection-string-parse";
import Debug from "debug";
const debug = Debug("@d10221/tiny-sql-connection-config");
/** */
let connectionConfig: ConnectionConfig;
/** */
export default function sqlConnectionConfig(envKey = "DB") {
  if (connectionConfig && connectionConfig.options.database === envKey) return connectionConfig;
  // ...
  const connectionString = process.env[envKey];
  if (!connectionString) {
    throw new Error(`process.env.${envKey} is NOT set!`);
  }
  connectionConfig = parseString(connectionString);
  debug(
    "Using %s/%s",
    connectionConfig.server,
    connectionConfig.options.database
  );
  return connectionConfig;
};
