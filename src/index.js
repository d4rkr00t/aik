import * as analyticsFns from "./analytics";
import * as deprecationFns from "./deprecation";

export { default as build } from "./commands/build";
export { default as devServer } from "./commands/dev-server";
export const analytics = analyticsFns;
export const deprecation = deprecationFns;
