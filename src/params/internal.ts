import { TediousParameter } from "./types";

export  function isTediousParameterLike(x: any): x is TediousParameter {
  return x && x.name && x.value && x.type && x.type.type && x.type.name;
}
/**
 *
 * @param x
 */
export  function isNullOrUndefined(x: any) {
  return typeof x === "undefined" || x === null;
}
/**
 * 
 * @param x 
 */
export  function isFunction(x: any): x is Function {
  return typeof x === "function";
 }