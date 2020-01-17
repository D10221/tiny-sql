process.env.NODE_ENV = "test";
process.env.DB="Data Source=localhost;Initial Catalog=testdb;user=test;password=test;"
/** */
describe("new-connection", () => {
    it("works", async () => {
        const { Connection } = await import("tedious");
        const { default: getconnection } = (await import("../src"));
        let connection: any;
        try {
            connection = await getconnection();
            expect(connection).toBeInstanceOf(Connection);
            expect(connection.execSql).toBeInstanceOf(Function);
        } finally {
            connection && connection.close();
        }
    })
})