import ExecSql from "../src/exec";
import Connect from "../src/connect";
import { Connection } from "tedious";

const connect = () => Connect(new Connection({ server: "localhost", authentication: { type: "default", options: { password: "test", userName: "test" } }, options: { encrypt: false } }))

/** */
it("execs with connection", async () => {
    let connection: Connection;
    try {
        connection = await connect();
        const result = await ExecSql<{ name: string }>("select 'x' as name")(connection);
        expect(result.values[0].name).toBe("x");
    } finally {
        connection && connection.close();
    }
});
/** */
it("exes with connection config", async () => {
    let connection: Connection;
    try {
        connection = await connect();
        const result = await ExecSql<{ name: string }>("select 'hello' as name")(connection);
        expect(result.values[0].name).toBe("hello");
    } finally {
        connection && connection.close();
    }
});
/** */
it("execs with params", async () => {
    let connection: Connection;
    try {
        connection = await connect();
        const { values } = await ExecSql<{ name: string }>("select @name as name", { name: "me" })(connection);
        expect(values[0].name).toBe("me");
    } finally {
        connection && connection.close();
    }
});
