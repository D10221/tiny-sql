import { KeyFilter } from "./types";
/** */
export interface Indexer { [key: string]: any };
// Hack
const OKeys = <T>(t: T)=> Object.keys(t) as (keyof T)[];
/** */
export default function filtterKeys<T extends Indexer, TK extends keyof T & string>(source: T, filter: KeyFilter<T, TK>) {
    return OKeys(source)
        .filter(key => filter(key as TK, source))
        .reduce((out, key) => {
            out[key] = source[key]; 
            return out;
        }, {} as Partial<{ [key in keyof T]: string}>);
}