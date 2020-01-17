import { Exec, connect, config } from "../src";
import { Connection } from "tedious";

process.env.DB = "Data Source=localhost;Initial Catalog=testdb;user=test;password=test;encrypt=false";

const getName = (name: string) => Exec<{ name: string }>("select @name as name", { name });

describe("usage", () => {
    it("works", async () => {
        let connection: Connection;
        try {
            connection = await connect(config("DB"));
            const { values } = await getName("me")(connection);
            expect(values[0].name).toBe("me");
        } finally {
            connection && connection.close();
        }
    })
})