import stripAnsi from "strip-ansi";
import syntaxErrorMock from "./mock-data/syntax-error.json";
import eslintWarningMock from "./mock-data/eslint-warning.json";
import webpackWarningMock from "./mock-data/webpack-warning.json";
import { formatMessages } from "../error-helpers";

describe("#formatMessages", () => {
  test("Format Syntax Error", () => {
    const [error] = formatMessages(syntaxErrorMock);
    expect(stripAnsi(error)).toMatchSnapshot();
  });

  test("Format ESLint Warnings", () => {
    const warnings = formatMessages(eslintWarningMock).join("\n\n\n");
    expect(stripAnsi(warnings)).toMatchSnapshot();
  });

  test("Format Webpack Warnings", () => {
    const warnings = formatMessages(webpackWarningMock).join("\n\n\n");
    expect(stripAnsi(warnings)).toMatchSnapshot();
  });

  test("Unknown messages", () => {
    const messages = ["some", "custom", "messages"];
    expect(formatMessages(messages)).toMatchSnapshot();
  });
});
