"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = last;
function last(arr) {
  if (!arr || !arr.length) return;
  return arr[arr.length - 1];
}