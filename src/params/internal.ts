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