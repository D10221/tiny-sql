import execSql from "../src/exec";
import using from "../src/using";
import connect from "../src/connect";
import config from "../src/config";
import { Connection, ISOLATION_LEVEL } from "tedious";

process.env.DB = `server=${process.env.SQL_SERVER_DATA_SOURCE};database=${process.env.SQL_SERVER_DATABASE};user=${process.env.SQL_SERVER_USER};password=${process.env.SQL_SERVER_PASSWORD};`;

const getConnection = () => connect(config("DB"));

const commit = (con: Connection) => () =>
  new Promise<void>((resolve, reject) => {
    try {
      con.commitTransaction(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
const rollback = (con: Connection) => () =>
  new Promise<void>((resolve, reject) => {
    try {
      con.rollbackTransaction(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
const beginTransaction = (
  connection: Connection,
  name?: string,
  isolationLevel?: ISOLATION_LEVEL,
) =>
  new Promise<{
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
  }>((resolve, reject) => {
    try {
      return connection.beginTransaction(
        err => {
          if (err) reject(err);
          else {
            resolve({
              commit: commit(connection),
              rollback: rollback(connection),
            });
          }
        },
        name,
        isolationLevel,
      );
    } catch (error) {
      reject(error);
    }
  });

const withTransaction = <T = any>(
  callback: (con: Connection) => Promise<T>,
) => async (connection: Connection) => {
  try {
    const { commit, rollback } = await beginTransaction(connection);
    try {
      const ret = await callback(connection);
      await commit();
      return ret;
    } catch (error) {
      await rollback();
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
function* range(from: number, to: number) {
  while (from <= to) {
    yield from++;
  }
}
describe("transaction", () => {
  it("commits", async () => {
    const values = await using(getConnection)(
      withTransaction(async con => {
        try {
          await execSql(
            "if(exists(select name from sys.tables where name = 'temptable')) drop table temptable",
          )(con);
          await execSql("create table temptable (value varchar(max))")(con);
          const insert = (value: string) =>
            execSql("insert into temptable (value) values (@value)", { value });
          for (const x of Array.from(range(1, 5))) {
            await insert(x.toString())(con);
          }
          const values = await execSql<{ value: string }>(
            "select value from  temptable",
          )(con).then(r => r!.values!.map(x => x!.value));
          return values;
        } catch (error) {
          return Promise.reject(error);
        }
      }),
    );
    expect(values).toMatchObject(["1", "2", "3", "4", "5"]);
  });
});

const getValue = (x: any) => (connection: any) =>
  execSql<{ x: any }>("select x=@x", { x })(connection).then(
    x => x.values && x.values[0].x,
  );
