import packageInfo from "../src/package-info";
const pkg = require("../package.json");
/**
 * 
 */
describe("package-info", () => {
    it("works", () => {
        const info = packageInfo(module.filename);
        expect(info.name).toBe(pkg.name);
        expect(info.main).toBe(pkg.main);
    })
})