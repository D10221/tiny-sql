import execSql from "../src/exec-sql";
import using from "../src/using";
import connect from "../src/connect-fty";
process.env.DB="server=localhost;database=testdb;user=test;password=test;"
describe("useConnection", () => {
  it("works", async () => {
    const value = await using(connect)(getValue(1))
    expect(value)
      .toBe(1)
  });
});
const getValue = (x: any) => (connection: any) => execSql(connection)<{ x: any }>("select x=@x", { x }).then(x => x.values[0].x);

