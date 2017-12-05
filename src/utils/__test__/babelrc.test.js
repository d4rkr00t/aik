import { getBabelrc } from "../babelrc";

describe("#getBabelrc", () => {
  test("should return babelrc config", () => {
    const config = getBabelrc("__fixtures__/config/subdir/another-sub-dir/index.js");
    expect(!!config.path).toBe(true);
    expect(config.config.plugins.length).toBe(1);
  });

  test("should return default config if babelrc doesn't exist", () => {
    const config = getBabelrc("../123123");
    expect(config.path).toBe("");
    expect(config.config.plugins.length).toBe(0);
  });

  test("should throw an error when unable to resolve babelrc plugins/extensions", () => {
    expect(() => getBabelrc("__fixtures__/config/subdir-with-unresolvable-ext/another-sub-dir/index.js")).toThrow();
  });
});
