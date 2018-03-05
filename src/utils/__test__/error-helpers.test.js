import stripAnsi from "strip-ansi";
import { formatMessages, extractInfoFromModuleNotFoundError } from "../error-helpers";
import { updateStatsMock } from "../../test-helpers/update-stats-mock";

describe("#formatMessages", () => {
  test("Format Syntax Error", () => {
    const stats = updateStatsMock("syntax-error");
    const [error] = formatMessages(stats.errors);
    expect(stripAnsi(error)).toMatchSnapshot();
  });

  test("Format ESLint Warnings", () => {
    const stats = updateStatsMock("eslint-warning");
    const warnings = formatMessages(stats.warnings).join("\n\n\n");
    expect(stripAnsi(warnings)).toMatchSnapshot();
  });

  test("Format Webpack Warnings", () => {
    const stats = updateStatsMock("webpack-warning");
    const warnings = formatMessages(stats.warnings).join("\n\n\n");
    expect(stripAnsi(warnings)).toMatchSnapshot();
  });

  test("Unknown messages", () => {
    const messages = ["some", "custom", "messages"];
    expect(formatMessages(messages)).toMatchSnapshot();
  });
});

describe("#extractInfoFromModuleNotFoundError", () => {
  test("should be able to extract module name and file name", () => {
    const stats = updateStatsMock("module-not-found");
    const { moduleName, file } = extractInfoFromModuleNotFoundError(stats.errors[0]);
    expect(moduleName).toBe("barbarbar");
    expect(file.includes("module-not-found/index.js")).toBe(true);
  });
});
