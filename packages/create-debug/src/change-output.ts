import { IDebugger } from "debug";
/** */
export type Log = (message?: any, ...optionalParams: any[]) => any;
/** */
export default function changeOutput(log: Log) {
  /** */
  return <T extends IDebugger>(d: T): T => {
    if (typeof log === "function") d.log = log;
    return d;
  };
}
