/** dummy logger */
class Logger {
  out: any[] = [];
  log = (format, args) => {
    this.out.push({ format, args });
  };
}
/** */
describe("module-debugger", () => {
  /** */
  it("changes-output", async () => {
    const Debug = require("debug");
    const { moduleDebugger } = await import("../src");
    const logger = new Logger();
    const out = logger.log.bind(logger);
    const debug = moduleDebugger(
      namespace => {
        return Debug(namespace);
      },
      {
        out
      }
    )(module);
    expect(debug.name).toBe("debug");
    expect(debug.log).toBe(out);
    debug.log("hello", "again");
    expect(logger.out[0].format).toBe("hello");
    expect(logger.out[0].args).toBe("again");
  });
});
