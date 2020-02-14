import { TediousParameter } from "./types";
import getType from "./get-type";
/**
 * TODO: Accept {} OR { [key: string] : string|number|Date|buffer.... OR TediousParameter[]  }
 */
export default function getParams<T>(args: T,
): TediousParameter[] {  
  if (typeof args === "object") return toParams(args);
  throw new Error(`Expected 'Array|Object' found instead '${typeof args}'`);
}
/** */
function getParam<T>(args: T) {
  /** */
  return (key: keyof T): TediousParameter => {
    const value = args[key];
    return {
      name: key.toString(),
      value,
      type: getType(value),
    };
  };
}
/**
 * map plain object to TediousParameter[]
 */
function toParams<T extends {}>(args: T): TediousParameter[] {  
  return (Object.keys(args || {}) as (keyof T)[]).map(getParam(args));
}
