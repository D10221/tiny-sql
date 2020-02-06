import execSql from "../src/execSql";
import Connect from "../src/connect";
import { Connection } from "tedious";

const connect = () =>
  Connect(
    new Connection({
      server: process.env.SQL_SERVER_DATA_SOURCE,
      authentication: {
        type: "default",
        options: {
          userName: process.env.SQL_SERVER_USER,
          password: process.env.SQL_SERVER_PASSWORD,
        },
      },
      options: {
        encrypt: false,
      },
    }),
  );
describe("execSql", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await connect();
  });
  afterAll(() => {
    connection.close();
  });
  /** */
  it("returns named column", async () => {
    const result = await execSql<{ name: string }>("select 'x' as name")(
      connection,
    );
    expect(result.values![0].name).toBe("x");
  });
  it("returns unnamed column", async () => {
    const result = await execSql<{ name: string }>("select 'x'")(connection);
    const val = result.values![0];
    expect(val).toMatchObject({ 0: "x" });
  });   
  /** */
  it("maps param", async () => {
    const { values } = await execSql<{ name: string }>("select @name as name", {
      name: "me",
    })(connection);
    expect(values![0].name).toBe("me");
  });
});
