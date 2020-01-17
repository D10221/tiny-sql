import { resolve, dirname, sep } from "path";
import { existsSync, } from "fs";
const back = `..${sep}`;
/** */
export default (filename: string): string => {
    if (!existsSync(resolve(filename))) {
        throw new Error(`${filename} doesn't exist`);
    }
    let packagePath;
    let dots = "";
    while (!(() => {
        packagePath = resolve(dirname(filename), dots + "package.json");
        return existsSync(packagePath)
    })()) {
        dots += back;
        if (dots.split(back).length > filename.split(sep).length) {
            return undefined;
        }
    }
    return packagePath;
}