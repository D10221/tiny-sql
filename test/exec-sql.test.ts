import  ExecSql from "../src/exec-sql";
import connect from "../src/connect";
import { Connection } from "tedious";

/** */
it("execs with connection", async () => {
  let connection: Connection;
  try {
    connection = await connect(new Connection({ server: "localhost", authentication: { type: "default", options: { password: "test", userName: "test" } }, options: { encrypt: false } }));
    const sqlTxt = "select 'x' as name";
    const execSql = ExecSql(connection);
    const result = await execSql<{ name: string }>(sqlTxt);
    expect(result.values[0].name).toBe("x");
  } finally {
    connection && connection.close();
  }
});
/** */
it("exes with connection config", async () => {
  let connection: Connection;
  try {
    connection = await connect(new Connection({ server: "localhost", authentication: { type: "default", options: { password: "test", userName: "test" } }, options: { encrypt: false } }));
    const sqlTxt = "select 'hello' as name";
    const execSql = ExecSql(connection);
    const result = await execSql<{ name: string }>(sqlTxt);
    expect(result.values[0].name).toBe("hello");
  } finally {
    connection && connection.close();
  }
});
/** */
it("execs with params", async () => {
  let connection: Connection;
  try {
    connection = await connect(new Connection({ server: "localhost", authentication: { type: "default", options: { password: "test", userName: "test" } }, options: { encrypt: false } }));
    const sqlTxt = "select @name as name";
    const exec = ExecSql(connection);
    const { values } = await exec<{ name: string }>(sqlTxt, {
      name: "me"
    });
    expect(values[0].name).toBe("me");
  } finally {
    connection && connection.close();
  }
});
