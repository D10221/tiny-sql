import execSql from "../src/exec";
import using from "../src/using";
import connect from "../src/connect";
import config from "../src/config";
process.env.DB = `server=${process.env.SQL_SERVER_DATA_SOURCE};database=${process.env.SQL_SERVER_DATABASE};user=${process.env.SQL_SERVER_USER};password=${process.env.SQL_SERVER_PASSWORD};`;
describe("useConnection", () => {
  it("works", async () => {
    const connection = await connect(config("DB"));
    const value = await using(async () => connection)(getValue(1));
    expect((connection as any).closed).toBe(true);
    expect(value).toBe(1);
  });
});
const getValue = (x: any) => (connection: any) =>
  execSql<{ x: any }>("select x=@x", { x })(connection).then(
    x => x.values && x.values[0].x,
  );
