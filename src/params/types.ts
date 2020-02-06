import { ParameterOptions, TediousType } from "tedious";
/** */
export type TediousParameter = {
    name: string;
    type: TediousType;
    value: any;
    options?: ParameterOptions;
};
