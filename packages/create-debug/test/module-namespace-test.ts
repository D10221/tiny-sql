import { basename, extname, dirname } from "path";

const pkg = require("../package.json");

describe("module-namespace", () => {
  it("works", async () => {
    const moduleInfoName = (await import("../src/module-namespace")).default;
    const xName = moduleInfoName(module);
    const parent = basename(__dirname);
    const expected = `${pkg.name}|${parent}|${basename(__filename).replace(
      extname(__filename),
      ""
    )}`;
    expect(xName).toBe(expected);
  });
  /**
   * module-x/lib/index.js -> @local/module-x
   * ignore dirname(package.main)
   * ignore index.*
   * */
  it("ext namespace", async () => {
    const modulex = await import("@local/module-x");
    expect(modulex.default.namespace).toBe("@local/module-x");
  });
  /**
   * collapse @local/module-x|submodule-z|submodule-z to @local/module-x|submodule-z
   */
  it("collapse namespace", async () => {
    const modulex = await import("@local/module-x");
    expect(modulex.submoduleZ.namespace).toBe("@local/module-x|submodule-z");
  });
  it("ext namespace no-main-dir", async () => {
    const debug = (await import("@local/module-y")).default;
    expect(debug.namespace).toBe("@local/module-y");
  });
  it("sub-module namespace", async () => {
    const xmodule = await import("./x-module");
    const debug = xmodule.default;
    const { submodule } = xmodule;
    expect(debug.namespace).toBe("@d10221/create-debug|test|x-module");
    expect(submodule.namespace).toBe(
      "@d10221/create-debug|test|x-module|x-sub-module"
    );
  });
});
