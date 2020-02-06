import execSql, { query } from "../src/execSql";
import Connect from "../src/connect";
import { Connection, TYPES } from "tedious";

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
  it("Query", async () => {
    const x: any = { rowCount: 1, rows: [], values: [{ 0: 0 }] };
    expect(await query(connection, "select @x", { x: 0 })).toMatchObject(x);
  });
  it("Query, no params", async () => {
    const x: any = { rowCount: 1, rows: [], values: [{ 0: 0 }] };
    expect(await query(connection, "select 0")).toMatchObject(x);
  });
  // it("Query value", async () => {
  //   const x: any = { rowCount: 1, rows: [], values: [{ 0: 0 }] };
  //   expect(
  //     await query(connection, "return 0", [
  //       {
  //         name: "out",
  //         type: TYPES.Int,
  //         out: true,
  //       },
  //     ]),
  //   ).toMatchObject(x);
  // });
});
