import { join } from "path";
import connect from "../src";
import { Connection } from "tedious";
/** */
describe(require(join(__dirname, "../package.json")).name, () => {
  it("works", async () => {
    const connection = await connect({
      server: "localhost",
      options: {
        database: "testdb",
        encrypt: false
      },
      authentication: {
        type: "default",
        options: {
          userName: "test",
          password: "test"
        }
      }
    });
    expect(connection).toBeInstanceOf(Connection);
    connection.close();
  });
});
