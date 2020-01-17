import { ConnectionConfig } from "tedious";
import parseString from "@d10221/tiny-sql-connection-string-parse";
import Debug from "debug";
const debug = Debug("@d10221/tiny-sql-connection-config");
/** */
let _cache_: { [key: string]: ConnectionConfig } = {};
/** */
export default function sqlConnectionConfig(key = "DB") {
  const connectionConfig = _cache_[key];
  if (connectionConfig) return connectionConfig;
  // ...
  const connectionString = process.env[key];
  if (!connectionString) {
    throw new Error(`process.env.${key} is NOT set!`);
  }
  _cache_[key] = parseString(connectionString);
  
  if (_cache_[key]) debug(
    "Using %s/%s",
    _cache_[key].server,
    _cache_[key].options.database
  );
  
  return _cache_[key];
};
