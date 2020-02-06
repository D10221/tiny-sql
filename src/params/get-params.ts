import { TediousParameter } from "./types";
import getType from "./get-type";
import { isTediousParameterLike } from "./internal";
/**
 * TODO: Accept {} OR { [key: string] : string|number|Date|buffer.... OR TediousParameter[]  }
 */
export default function getParams(
  args: TediousParameter[] | {},
): TediousParameter[] {
  if (Array.isArray(args)) {
    if (!args.length) {
      return args;
    }
    for (const value of args) {
      if (!isTediousParameterLike(value)) {
        throw new Error("Array must be of TediousParameter");
      }
    }
    return args as TediousParameter[];
  }
  if (typeof args === "object") return toParams(args);
  throw new Error(`Expected 'Array|Object' found instead '${typeof args}'`);
}
/** */
function getParam<T>(args: T) {
  /** */
  return (key: keyof T & string): TediousParameter => {
    const value = args[key];
    return {
      name: key,
      value,
      type: getType(value),
    };
  };
}
/**
 * map plain object to TediousParameter[]
 */
function toParams<T>(args: T): TediousParameter[] {
  return (Object.keys(args || {}) as (keyof T & string)[]).map(getParam(args));
}
