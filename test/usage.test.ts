import { Exec, connect, config } from "../src";
import { Connection } from "tedious";

process.env.DB =
  `Data Source=${process.env.SQL_SERVER_DATA_SOURCE};` +
  `Initial Catalog=${process.env.SQL_SERVER_DATABASE};` +
  `user=${process.env.SQL_SERVER_USER};` +
  `password=${process.env.SQL_SERVER_PASSWORD};` +
  `encrypt=false;`;

const getName = (name: string) =>
  Exec<{ name: string }>("select @name as name", { name });

describe("usage", () => {
  it("works", async () => {
    let connection: Connection | undefined = undefined;
    try {
      connection = await connect(config("DB"));
      const { values } = await getName("me")(connection);
      expect(values![0].name).toBe("me");
    } finally {
      connection && connection.close();
    }
  });
});
