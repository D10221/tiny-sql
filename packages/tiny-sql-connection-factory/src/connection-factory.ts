import connect from "@d10221/tiny-sql-connect";
import connectionConfig from "@d10221/tiny-sql-connection-config";
import { Connection } from "tedious";
/**
 * default conneciton from defaul env var
 */
export default (envKey = "DB"): Promise<Connection> => connect(connectionConfig(envKey));