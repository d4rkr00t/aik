"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = testUtils;
function testUtils() {
  if (process.env.AIK_TEST) {
    process.exit(0);
  }
}