import execSql, { query, Result } from "../src/execSql";
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
describe("exec-sql", () => {
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
  it("value as query", async () => {
    const result = await query(
      connection,
      `
      create table #temp(id INT not null);
      insert into #temp (id) VALUES (1);
      insert into #temp (id) VALUES (2);
      insert into #temp (id) VALUES (3);
      SELECT count(id) FROM #temp;
      `,
    );
    const expected: Result<any> = {
      values: [{ 0: 3 }],
      rowCount: 4,
      rows: [],
    };
    expect(result).toMatchObject(expected);
  });
  it("out param (wip)", async () => {
    const x: any = { rowCount: 1, rows: [], values: [] };
    expect(
      await query(connection, "SET @out = 999;", [
        {
          name: "out",
          type: TYPES.Int,
          out: true,
        },
      ]),
    ).toMatchObject(x);
  });
});
