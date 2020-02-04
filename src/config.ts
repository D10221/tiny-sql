import { ConnectionConfig } from "tedious";
import parseString from "./parse";
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
  return _cache_[key];
}
