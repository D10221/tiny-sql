process.env.NODE_ENV = "test";
process.env.DB="Data Source=localhost;Initial Catalog=testdb;user=test;password=test;"
process.env.DB1="Data Source=local;Initial Catalog=xdb;user=test;password=test;"
/** */
describe("connection-config", () => {
    it("works without parameters", async () => {
        const connectionConfig = (await import("../src")).default();
        expect(connectionConfig.server).toEqual("localhost");
        expect(connectionConfig.userName).toEqual("sa");
        expect(connectionConfig.password).toEqual("P@55w0rd!");
        expect(connectionConfig.options.database).toEqual("testdb");
        expect(connectionConfig.options.encrypt).toBe(false);
    })
    it("works with parameters", async () => {        
        const connectionConfig = (await import("../src")).default("DB1");
        expect(connectionConfig.server).toEqual("local");
        expect(connectionConfig.userName).toEqual("me");
        expect(connectionConfig.password).toEqual("password");
        expect(connectionConfig.options.database).toEqual("xdb");
        expect(connectionConfig.options.encrypt).toBe(true);
    })
    it("changes key", async () => {        
        const connectionConfig = (await import("../src")).default();
        expect(connectionConfig.server).toEqual("localhost");
        expect(connectionConfig.userName).toEqual("sa");
        expect(connectionConfig.password).toEqual("P@55w0rd!");
        expect(connectionConfig.options.database).toEqual("testdb");
        expect(connectionConfig.options.encrypt).toBe(false);
    })
});