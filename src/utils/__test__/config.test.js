import path from "path";
import { loadConfig, findUpwards } from "../config";

describe("#findUpwards", () => {
  test("should go up directory tree until it finds a config", () => {
    expect(
      findUpwards({
        configName: ".babelrc",
        dir: path.join(__dirname, "..", "..", "..", "__fixtures__", "config", "subdir", "another-sub-dir")
      })
    ).toBeDefined();
  });

  test("should return undefined if config doesn't exist", () => {
    expect(
      findUpwards({
        configName: ".babelrc-bla-bla",
        dir: path.join(__dirname, "..", "..", "..", "__fixtures__", "config", "subdir", "another-sub-dir")
      })
    ).toBeUndefined();
  });
});

describe("#loadConfig", () => {
  test("should return empty object if config doesn't exist", () => {
    expect(loadConfig({ configName: ".babelrc-bla-bla", filename: "index.js" })).toEqual({});
  });

  test("should return config", () => {
    expect(
      loadConfig({
        configName: ".babelrc",
        filename: "__fixtures__/config/subdir/another-sub-dir/index.js"
      })
    ).toMatchObject({
      config: {
        presets: ["babel-preset-env"],
        plugins: ["babel-plugin-syntax-flow"]
      }
    });
  });

  test("should throw an error when unable to parse a config", () => {
    expect(() =>
      loadConfig({
        configName: ".babelrc",
        filename: "__fixtures__/config/subdir-with-broken-babelrc/another-sub-dir/index.js"
      })
    ).toThrow();
  });
});
