import isFunction from "./is-function";
import { KeyFilter } from "./types";
import Debug from "debug";
const debug = Debug("@d10221/tiny-sql-params/get-fields");
/**
 * 
 */
export default function getFields<T extends { [key: string]: any }, TK extends keyof TK & string>(item: T, exclude?: ((keyof T)[]) | KeyFilter<T, TK>): string {
  exclude = exclude || [];
  const keys = Object.keys(item).filter(
    key => !exclude || (!isFunction(exclude) ? exclude.indexOf(key as keyof T) === -1 : exclude(key as TK, item))
  );
  let fields = keys.map(key => `${key} = @${key}`).join(",");
  debug("fields: %s", fields);
  return fields;
}
