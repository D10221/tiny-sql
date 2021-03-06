import config from "../src/config";
process.env.NODE_ENV = "test";
process.env.DB = "Data Source=localhost;Initial Catalog=testdb;user=test;password=test;";
process.env.DB1 = "Data Source=local;Initial Catalog=xdb;user=test;password=test;encrypt=true";
/** */
describe("connection-config", () => {
    it("works without parameters", async () => {
        const connectionConfig = config();
        expect(connectionConfig.server).toEqual("localhost");
        expect(connectionConfig.authentication!.options!.userName).toEqual("test");
        expect(connectionConfig.authentication!.options!.password).toEqual("test");
        expect(connectionConfig.options!.database).toEqual("testdb");
        expect(connectionConfig.options!.encrypt).toBe(false);
    })
    it("works with parameters", async () => {
        const connectionConfig = config("DB1");
        expect(connectionConfig.server).toEqual("local");
        expect(connectionConfig.authentication!.options.userName).toEqual("test");
        expect(connectionConfig.authentication!.options.password).toEqual("test");
        expect(connectionConfig.options!.database).toEqual("xdb");
        expect(connectionConfig.options!.encrypt).toBe(true);
    })
    it("changes key", async () => {
        const connectionConfig = config();
        expect(connectionConfig.server).toEqual("localhost");
        expect(connectionConfig.authentication!.options!.userName).toEqual("test");
        expect(connectionConfig.authentication!.options!.password).toEqual("test");
        expect(connectionConfig.options!.database).toEqual("testdb");
        expect(connectionConfig.options!.encrypt).toBe(false);
    })
});