/* @flow */

export default function testUtils() {
  if (process.env.AIK_TEST) {
    process.exit(0);
  }
}
