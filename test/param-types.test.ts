import ExecSql from "../src/exec";
import Connect from "../src/connect";
import { Connection } from "tedious";

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

const exec = <ParameterType, ResultType>(
  query: string, //
) => (
  p: {} | ParameterType | undefined = undefined, //
) => (
  connection: Connection, //
) => ExecSql<ResultType>(query, p)(connection);

const dateQuery = exec<{ date: any }, { date: any }>(`
create table #temp (date DATE not null)
insert into #temp (date) VALUES (@date);
select * from #temp
`);

describe("Parmeter types", () => {
  it("Implicit Date Conversion", async () => {
    const connection = await connect();
    try {
      const result = await dateQuery({ date: "2020-01-01" })(connection);
      const { date } = result.values![0];
      expect(date).toBeInstanceOf(Date);
      expect((date as Date).toISOString().split("T")[0]).toBe("2020-01-01");
    } catch (error) {
      throw error;
    } finally {
      connection.close();
    }
  });
  it("Date to Date Conversion", async () => {
    const connection = await connect();
    try {
      const result = await dateQuery({ date: new Date("2020-01-01") })(
        connection,
      );
      const { date } = result.values![0];
      expect(date).toBeInstanceOf(Date);
      expect((date as Date).toISOString().split("T")[0]).toBe("2020-01-01");
    } catch (error) {
      throw error;
    } finally {
      connection.close();
    }
  });
});
