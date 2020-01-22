import execSql from "../src/exec";
import using from "../src/using";
import connect from "../src/connect-fty";
process.env.DB = `server=${process.env.SQL_SERVER_DATA_SOURCE};database=${process.env.SQL_SERVER_DATABASE};user=${process.env.SQL_SERVER_USER};password=${process.env.SQL_SERVER_PASSWORD};`;
describe("useConnection", () => {
  it("works", async () => {
    const value = await using(connect)(getValue(1));
    expect(value).toBe(1);
  });
});
const getValue = (x: any) => (connection: any) =>
  execSql<{ x: any }>("select x=@x", { x })(connection).then(
    x => x.values && x.values[0].x,
  );
