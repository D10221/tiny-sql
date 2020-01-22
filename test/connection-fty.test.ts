import { Connection } from "tedious";
import { connectFty } from "../src";

process.env.NODE_ENV = "test";
process.env.DB = `Data Source=${process.env.SQL_SERVER_DATA_SOURCE};Initial Catalog=${process.env.SQL_SERVER_DATABASE};user=${process.env.SQL_SERVER_USER};password=${process.env.SQL_SERVER_PASSWORD};`;

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