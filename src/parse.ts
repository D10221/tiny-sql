import { ConnectionConfig } from "tedious";
/**
 * sample 'Data Source=(local);Initial Catalog=DBNAME;user=sa;password=xxx;'
 * */
export default function parseString(
  connectionString: string,
): ConnectionConfig {
  if (connectionString.indexOf("Integrated Security") !== -1) {
    throw new Error("Integrated Security is Not Implemented");
  }
  const config = connectionString
    .split(";")
    .filter(Boolean)
    .reduce((out, next) => {
      const [key, value] = next.split("=");
      return {
        ...out,
        [key ? key.toLowerCase() : key]: value,
      };
    }, {} as { [key: string]: string });

  const dataSource = config["data source"] || config["server"];
  const server = dataSource || "";
  const port =
    (dataSource && (Number(dataSource.split(":")[1]) || 1433)) || NaN;
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
      },
    },
    options: {
      database,
      port,
      encrypt,
    },
  };
}
