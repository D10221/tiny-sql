import "@d10221/load-env";
import { join } from "path";
import connect from "@d10221/tiny-sql-connect-to-server";
import execSql from "@d10221/tiny-sql-exec-sql";
import useConnection from "../src";
/**
 * ?
 */
describe(require(join(__dirname, "../package.json")).name, () => {
  /**
   * 
   */
  it("works", async () => {
    const value = await useConnection(connect)(getValue(1))
    expect(value)
      .toBe(1)
  });
});
const getValue = (x) => (connection) => execSql(connection)<{ x }>("select x=@x", { x }).then(x => x.values[0].x);

