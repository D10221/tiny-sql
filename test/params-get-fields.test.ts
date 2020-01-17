import { join } from "path";
const name = require(join(__dirname, "../package.json")).name;
import { getFields, notNullField, combineFilters, excludeKeys } from "../src/params";

describe(name + "-get-fields", () => {
  it("works", () => {
    const filters = combineFilters(notNullField, excludeKeys());
    expect(getFields({}, filters)).toBe("");
    expect(getFields({ x: undefined }, filters)).toBe("");
    expect(getFields({ x: null }, filters)).toBe("");

  })
})