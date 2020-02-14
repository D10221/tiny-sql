import { TediousType, TYPES } from "tedious";
import { isNullOrUndefined } from "./internal";

export default function getType(value: any): TediousType {
  if (isNullOrUndefined(value)) return value;
  switch (typeof value) {
    case "string":
      return TYPES.VarChar;
    case "number":
      return /\.|,/.test(`${value}`) ? TYPES.Float : TYPES.Int;
    case "boolean":
      return TYPES.Bit;
    default: {
      if (value instanceof Buffer) return TYPES.Binary;
      if (value instanceof Date) return TYPES.DateTime;
      if (value === null) return TYPES.Null;
      throw new Error(`${value}:${typeof value} Not Implemented`);
    }
  }
}
