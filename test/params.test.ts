import { getParams, TediousParameter, addParams } from "../src/params";
import { TYPES, Request } from "tedious";
import getType from "../src/params/get-type";
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
    const nullValue: TediousParameter = {
      type: TYPES.Null,
      value: null,
      name: "nullValue"
    };
    const params = {
      x: "x",
      int: 0,
      float: 0.1,
      bit: false,
      date: now,
      binary: Buffer.from(""),
      nullValue: null as any
    };
    expect(getParams(params)).toMatchObject([
      varchar,
      int,
      float,
      bit,
      date,
      binary,
      nullValue
    ]);
  });
  it("maps Null", ()=>{
    const Null = TYPES.Null;
    expect(getType(null)).toMatchObject(Null)
  })
  function all<T>(xxx: T[], test: (x: T) => boolean) {
    return xxx.reduce((prev, next) => prev && test(next), true);
  }
  it("handles null", () => {
    const req = new Request("select @x", err => { });
    addParams(req, {
      value: null
    });
    const params = (req as any).parameters;
    expect(
      // all params
      all(params, Boolean)
    ).toBe(true);
    expect(
      // all params have type    
      all(params, (x: any) => Boolean(x.type))
    ).toBe(true);
    const fst = params[0];
    expect(fst.value ).toBeNull();
  })
});
