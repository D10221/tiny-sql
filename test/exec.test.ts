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

/** */
it("execs with connection", async () => {
  let connection: Connection | undefined;
  try {
    connection = await connect();
    const result = await ExecSql<{ name: string }>("select 'x' as name")(
      connection,
    );
    expect(result.values![0].name).toBe("x");
  } finally {
    typeof connection !== "undefined" && connection!.close();
  }
});
/** */
it("exes with connection config", async () => {
  let connection: Connection | undefined;
  try {
    connection = await connect();
    const result = await ExecSql<{ name: string }>("select 'hello' as name")(
      connection,
    );
    expect(result.values![0].name).toBe("hello");
  } finally {
    typeof connection !== "undefined" && connection!.close();
  }
});
/** */
it("execs with params", async () => {
  let connection: Connection | undefined;
  try {
    connection = await connect();
    const { values } = await ExecSql<{ name: string }>("select @name as name", {
      name: "me",
    })(connection);
    expect(values![0].name).toBe("me");
  } finally {
    typeof connection !== "undefined" && connection!.close();
  }
});
