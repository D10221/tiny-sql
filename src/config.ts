import { ConnectionConfig } from "tedious";
import parseString from "./parse";
/** */
let _cache_: { [key: string]: ConnectionConfig } = {};
/**
 * Parse basic connection string from named ENV var 
 */
function fromEnv(key = "DB", env = process.env) {
  const connectionConfig = _cache_[key];
  if (connectionConfig) return connectionConfig;
  // ...
  const connectionString = env[key];
  if (!connectionString) {
    throw new Error(`env.${key} is NOT set!`);
  }
  _cache_[key] = parseString(connectionString);
  return _cache_[key];
}
/** */
function fromJson(json: string){  
  return JSON.parse(json) as ConnectionConfig;
}
/** */
const from = (...args: any[]) => {
  switch (typeof args[0]) {
    case "string": {
      switch (typeof args[1]) {
        case "object": {
          return fromEnv(args[0], args[1])
        }
        case "undefined": {
          if (args[0].startsWith("{")) return fromJson(args[0]);
          else if (/=/.test(args[0])) return parseString(args[0]);
          else return fromEnv(args[0])
        }
        default: {
          throw new Error(`Connection from [${args[0]}${typeof args[0]},${args[1]}${typeof args[1]}] Not Implemented`);
        }
      }
    }
    case "undefined": return fromEnv(); //try default
    default: throw new Error(`Connection from ${args[0]}${typeof args[0]} Not Implemented`);
  }
}
export default {
  from,
}