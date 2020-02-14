import execSql from "../src/execSql";
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
    ) => execSql<ResultType>(query, p)(connection);

const dateQuery = exec<{ date: any }, { date: any }>(`
create table #temp (date DATE not null)
insert into #temp (date) VALUES (@date);
select * from #temp
`);

let connection: Connection;
beforeAll(async () => {
  connection = await connect();
})
afterAll(() => {
  connection && connection.close();
});

describe("Parmeters", () => {
  it("Implicit Date Conversion", async () => {
    const result = await dateQuery({ date: "2020-01-01" })(connection);
    const { date } = result.values![0];
    expect(date).toBeInstanceOf(Date);
    expect((date as Date).toISOString().split("T")[0]).toBe("2020-01-01");
  });
  it("Date to Date Conversion", async () => {
    const result = await dateQuery({ date: new Date("2020-01-01") })(
      connection,
    );
    const { date } = result.values![0];
    expect(date).toBeInstanceOf(Date);
    expect((date as Date).toISOString().split("T")[0]).toBe("2020-01-01");
  });
  it("handles Null?", async () => {
    const sql = `
    create table #temp ([id] int not null identity(1,1), [value] varchar(max) NULL);
    insert into #temp ([value]) VALUES (@value);
    return * from #temp
    `;
    const result = await exec<{ value: any }, { id: number, value: any }>(sql)({ value: null })(connection);
    expect(result.values[0].value).toBeNull();
  })
});
