import connect from "./connect";
import connectionConfig from "./config";
import { Connection } from "tedious";
/**
 * default conneciton from defaul env var
 */
export default (envKey = "DB"): Promise<Connection> => connect(connectionConfig(envKey));