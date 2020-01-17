import ExecSql from "../src";
import connect from "@d10221/tiny-sql-connect";
import { Connection } from "tedious";

const config = { server: "localhost", password: "test", userName: "test", options: { encrypt: false } };
/** */
it("execs with connection", async () => {
  let connection: Connection;
  try {    
    connection = await connect(config);
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
    connection = await connect(config);
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
    connection = await connect(config);
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
