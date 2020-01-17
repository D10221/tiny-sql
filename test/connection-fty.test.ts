import { Connection } from "tedious";
import { connectFty } from "../src";

process.env.NODE_ENV = "test";
process.env.DB = "Data Source=localhost;Initial Catalog=testdb;user=test;password=test;"
/** */
describe("new-connection", () => {
    it("works", async () => {

        let connection: any;
        try {
            connection = await connectFty();
            expect(connection).toBeInstanceOf(Connection);
            expect(connection.execSql).toBeInstanceOf(Function);
        } finally {
            connection && connection.close();
        }
    })
})