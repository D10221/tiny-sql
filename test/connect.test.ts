import { connect } from "../src";
import { Connection } from "tedious";
/** */
describe("connect", () => {
  it("works", async () => {
    const connection = await connect({
      server: process.env.SQL_SERVER_DATA_SOURCE,
      options: {
        database: process.env.SQL_SERVER_DATABASE,
        encrypt: false,
      },
      authentication: {
        type: "default",
        options: {
          userName: process.env.SQL_SERVER_USER,
          password: process.env.SQL_SERVER_PASSWORD,
        },
      },
    });
    expect(connection).toBeInstanceOf(Connection);
    connection.close();
  });
});
