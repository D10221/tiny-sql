import { IDebug, IDebugger } from "debug";
import changeOutput, { Log } from "./change-output";
import moduleNameSpace from "./module-namespace";
/** partial IDebug */
export type IDebugFty = (namespace: string) => IDebugger;
/** */
export interface Options {
  out?: Log;
  suffix?: string;
}
/** */
const defaultOptions: Options = {
  out: undefined,
  suffix: ""
};
/** */
function env() {
  const { DEBUG_NAMESPACE_SUFFIX, DEBUG_TO } = process.env;
  /** suffix/terminator */
  const suffix =
    typeof DEBUG_NAMESPACE_SUFFIX === "string"
      ? DEBUG_NAMESPACE_SUFFIX
      : defaultOptions.suffix;
  //
  let out: Log = undefined;
  switch (DEBUG_TO) {
    case "stdout": {
      out = console.log.bind(console);
      break;
    }
    default: {
      // ...
    }
  }
  return {
    out,
    suffix
  };
}
/**
 *
 */
export default function moduleDebugger(
  Debug: IDebug|IDebugFty,
  options: Options = defaultOptions
) {
  options = {
    ...defaultOptions,
    ...env(),
    ...(options || {})
  };
  const { suffix } = options;
  /** */
  return (target: NodeModule): IDebugger => {
    const namespace = moduleNameSpace(target) + suffix;
    return changeOutput(options.out)(Debug(namespace));
  };
}
