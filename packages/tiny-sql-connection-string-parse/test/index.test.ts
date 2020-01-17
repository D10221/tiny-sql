/** */
describe("parse-connection-string", () => {
  it("works", async () => {
      const parseString = (await import("../src")).default;
      const connectionConfig = parseString("Data Source=localhost;user=test;password=test1;Initial Catalog=x;");
      expect(connectionConfig.server).toEqual("localhost");
      expect(connectionConfig.userName).toEqual("test");
      expect(connectionConfig.password).toEqual("test1");
      expect(connectionConfig.options.database).toEqual("x");
      expect(connectionConfig.options.encrypt).toBe(false);
  })
  it("works1", async () => {
    const parseString = (await import("../src")).default;
    const connectionConfig = parseString("data source=localhost;database=MyDb;user=test;password=test1;encrypt=true");
    expect(connectionConfig.server).toEqual("localhost");
    expect(connectionConfig.userName).toEqual("test");
    expect(connectionConfig.password).toEqual("test1");
    expect(connectionConfig.options.database).toEqual("MyDb");
    expect(connectionConfig.options.encrypt).toBe(true);
})
})