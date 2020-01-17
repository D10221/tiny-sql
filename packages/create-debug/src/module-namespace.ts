import { dirname, extname, sep, basename } from "path";
import packageInfo from "./package-info";
/** */
export interface NodeModuleLike {
  filename: string
}
/** */
export default function moduleNamespace(
  xModule: NodeModuleLike,
  delimiter = "|"
): string { 
  const pkg = packageInfo(xModule.filename);
  const mainDir = dirname(pkg.main).replace(".", "");
  const regex = `^(?:\\/|\\\\)${mainDir}(.*)`;
  let fullName = xModule.filename
    .replace(pkg.dirname, "")
    .replace(new RegExp(regex), (s, args) => {
      return args || s;
    });
  const xName = basename(fullName)
    .replace(extname(fullName), "")
    .replace(/^index$/, "");
  const parent = dirname(fullName).replace(".", "");
  const parents = parent
    .split(sep)
    .filter(x => !!x)    
    .join(delimiter);
  const value = [pkg.name, parents, xName]
    // not-empty
    .filter(x => !!x)
    // collapse
    .reduce((out, next) => {
      if (out[out.length - 1] !== next) {
        out = out.concat(next);
      } 
      // else out = out.concat(".")
      return out;
    }, [])
    .join(delimiter);
  return value;
}
