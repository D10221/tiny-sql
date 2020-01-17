import packagePath from "./package-path";
import { dirname } from "path";
/** */
export interface PackageInfo {
    name: string;
    main?: string;
    dirname: string;
}
/** */
export default (filename: string): PackageInfo => {
    const path = packagePath(filename);
    if(!path) return undefined;
    const { name, main } = require(path);
    const pkgDirName = dirname(path);
    return {
        name, main, dirname: pkgDirName
    };
}