import execSql from "../src/exec";
import using from "../src/using";
import connect from "../src/connect";
import config from "../src/config";
import { withTransaction } from "../src/transaction";
import { Connection } from "tedious";
import { randomString, range, isClosed, inTransaction } from "./utils";

process.env.DB = `server=${process.env.SQL_SERVER_DATA_SOURCE};database=${process.env.SQL_SERVER_DATABASE};user=${process.env.SQL_SERVER_USER};password=${process.env.SQL_SERVER_PASSWORD};`;
/** */
const getConnection = () => connect(config("DB"));
/** */
const temptable = "table_" + randomString();
/** */
const dropTable = execSql(
  `if(exists(SELECT name FROM sys.tables WHERE name = '${temptable}')) DROP TABLE [${temptable}]`,
);
/** */
const createTable = execSql(
  `CREATE TABLE [${temptable}] (value INT NOT NULL UNIQUE)`,
);
/** */
const insert = (value: number) =>
  execSql(`INSERT into [${temptable}] (value) VALUES (@value)`, { value });
/** */
const remove = (value: number) =>
  execSql(`DELETE [${temptable}] WHERE value = @value`, { value });
class RollbackError extends Error {
  constructor(message: string) {
    super(message);
  }
}
/** */
const removeAll = async (con: Connection) => {
  let i = 0;
  for (const x of toInsert) {
    await remove(x)(con);
    i++;
  }
  return i;
};
/** */
const getValues = async (con: Connection) => {
  const values = await execSql<{ value: string }>(
    `SELECT value FROM  ${temptable}`,
  )(con).then(r => r!.values!.map(x => x!.value));
  return values;
};
const toInsert = Array.from(range(1, 5));
/** */
const shouldCommit = async (con: Connection) => {
  try {
    await dropTable(con);
    await createTable(con);
    let i = 0;
    for (const x of toInsert) {
      await insert(x)(con);
      i++;
    }
    return i;
  } catch (error) {
    return Promise.reject(error);
  }
};
/** */
const shouldRollback = async (con: Connection) => {
  const count = await removeAll(con);
  if (count != toInsert.length) {
    throw new Error("Remove All Failed");
  }
  const values = await getValues(con);
  if (values.length != 0) {
    throw new Error("Remove All Failed");
  }
  throw new RollbackError(temptable);
};

describe("transaction", () => {
  beforeAll(() =>
    getConnection()
      .then(async c => {
        await dropTable(c);
        await createTable(c);
        return c;
      })
      .then(c => c.close()),
  );

  afterAll(() =>
    getConnection()
      .then(c => {
        dropTable(c);
        return c;
      })
      .then(c => c.close()),
  );

  it("commits", async () => {
    // ...
    {
      const con = await getConnection();
      const count = await using(async () => con)(withTransaction(shouldCommit));
      expect(count).toBe(5);
      // outside transaction
      expect(isClosed(con)).toBe(true);
      expect(inTransaction(con)).toBe(false);
      const values = await using(getConnection)(getValues);
      expect(values).toMatchObject(toInsert);
    }
  });

  it("rollsback", async () => {
    // ...TODO
    const con = await getConnection();
    const _connect = async () => con;
    const x: any = await using(_connect)(withTransaction(shouldRollback)).catch(
      e => e,
    );
    expect(isClosed(con)).toBe(true);
    expect(inTransaction(con)).toBe(false);
    expect(x).toBeInstanceOf(RollbackError);
    expect(x.message).toBe(temptable);
    const values = await using(getConnection)(getValues);
    expect(values).toMatchObject(toInsert);
  });
});
