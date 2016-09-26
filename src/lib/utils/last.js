/* @flow */

export default function last(arr:?Array<any>) {
  if (!arr || !arr.length) return;
  return arr[arr.length - 1];
}
