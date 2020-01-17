import { debugModule } from "../../src";
const debug = debugModule(module);
debug("hello");
export default debug;
export { default as submodule } from "./x-sub-module";