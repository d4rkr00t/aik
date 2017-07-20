/* @flow */
export default function isEmptyObject(obj: Object): boolean {
  return !Object.keys(obj).length;
}
