import { debugModule } from "../../src";
const debug = debugModule(module);
debug("hello");
export default debug;