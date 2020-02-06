import { getParams, TediousParameter } from "../src/params";
import { TYPES } from "tedious";
/** */
describe("getParams", () => {
  /** */
  it("maps from {...}", () => {
    const varchar: TediousParameter = {
      name: "x",
      type: TYPES.VarChar,
      value: "x",
    };
    const int: TediousParameter = {
      name: "int",
      type: TYPES.Int,
      value: 0,
    };
    const float: TediousParameter = {
      name: "float",
      type: TYPES.Float,
      value: 0.1,
    };
    const bit: TediousParameter = {
      name: "bit",
      type: TYPES.Bit,
      value: false,
    };
    const binary: TediousParameter = {
      type: TYPES.Binary,
      value: Buffer.from(""),
      name: "binary",
    };
    const now = new Date(Date.now());
    const date: TediousParameter = {
      type: TYPES.DateTime,
      value: now,
      name: "date",
    };
    const params = {
      x: "x",
      int: 0,
      float: 0.1,
      bit: false,
      date: now,
      binary: Buffer.from(""),
    };
    expect(getParams(params)).toMatchObject([
      varchar,
      int,
      float,
      bit,
      date,
      binary,
    ]);
  });
});
