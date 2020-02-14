import { Request } from "tedious";
import { TediousParameter } from "./types";
import getParams from "./get-params";

export default function addParams(request: Request, args: TediousParameter[] | {}) {
    const params = Array.isArray(args) ? args : getParams(args);
    if (params && params.length > 0) {
        for (const p of params) {
            const { name, type, value, options, out } = p;
            if (out) {
                request.addOutputParameter(name, type, value, options);
            } else {
                request.addParameter(name, type, value, options);
            }
        }
    }
}