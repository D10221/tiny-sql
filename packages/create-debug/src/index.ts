import { default as moduleDebugger, Options } from "./module-debugger";
import { IDebugger } from "debug";
/**
 * export with default options
 */
export function debugModule(m: NodeModule, options?: Options): IDebugger {
  return moduleDebugger(require("debug"), options)(m);
}
/**
 * to change IDebug/IDebugFty instead of "debug"
 */
export { moduleDebugger };
