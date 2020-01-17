import { ConnectionConfig } from "tedious";
import Debug from "debug";
const debug = Debug("@d10221/tiny-sql-connection-string-parse");
/** 
 * sample 'Data Source=(local);Initial Catalog=DBNAME;user=test;password=test;'
 * */
export default function parseString(connectionString: string): ConnectionConfig {
  try {
    if (connectionString.indexOf("Integrated Security") !== -1) {
      throw new Error("Integrated Security is Not Implemented");
    }
    const config = connectionString.split(";")
      .filter(Boolean)
      .reduce((out, next) => {
        const [key, value] = next.split("=");
        return {
          ...out,
          [key ? key.toLowerCase() : key]: value
        }
      }, {} as { [key: string]: string });

    const dataSource = config["data source"] || config["server"];
    const server = dataSource && dataSource.split(":")[0].replace("(local)", "localhost") || "";
    const port = dataSource && (Number(dataSource.split(":")[1]) || 1433) || NaN;
    let database = config["initial catalog"];
    database = database || config["database"];
    // non standard?
    const encrypt = Boolean(config["encrypt"]);
    return {
      server,
      authentication: {
        type: "default",
        options: {
          userName: config["user"],
          password: config["password"],
        }
      },
      options: {
        database,
        port,
        encrypt
      }
    }
  } catch (error) {
    debug("can't parse connection-string: %s", error.message);
    return undefined;
  }
}