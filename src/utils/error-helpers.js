/* @flow */

import chalk from "chalk";

const SYNTAX_ERROR_LABEL = "SyntaxError:";
const SYNTAX_ERROR_LABEL_HUMAN_FRIENDLY = "Syntax Error:";
const ESLINT_PARSE_ERROR = "Parsing error:";

/**
 * Checks whether error is syntax error.
 */
export function isSyntaxError(message: string): boolean {
  return (
    message.indexOf(SYNTAX_ERROR_LABEL) !== -1 ||
    message.indexOf(SYNTAX_ERROR_LABEL_HUMAN_FRIENDLY) !== -1
  );
}

/**
 * Checks whether error is eslint rules warning.
 */
export function isEslintWarning(message: string): boolean {
  return !!message.match(/\d\sproblem/) && !!message.match("warning");
}

/**
 * Checks whether error is eslint parse error.
 */
export function isEslintParseError(message: string): boolean {
  return !!message.match(ESLINT_PARSE_ERROR);
}

export function isDependencyAnExpression(message: string): boolean {
  return !!message.match("the request of a dependency is an expression");
}

export function isPrebuildFileWarning(message: string): boolean {
  return !!message.match("This seems to be a pre-built javascript file");
}

export function findMessagesToFormat(messages: string[]): string[] {
  return messages.filter(message => {
    if (isEslintParseError(message)) {
      return false;
    }

    if (isDependencyAnExpression(message)) {
      return false;
    }

    if (isPrebuildFileWarning(message)) {
      return false;
    }

    return true;
  });
}

export function isFileSnippetLine(line: string): boolean {
  return !!line.match(/\s+\|/);
}

export function isEslintWarningRuleLine(line: string): boolean {
  return !!line.match(/\d+:\d+(.+)warning/);
}

export function getLinePadding(line: string): number {
  return line.split("").findIndex(c => !!c.match(/\S/));
}

export function removeLinePadding(padding: number, line: string): string {
  return line.substring(padding);
}

/**
 * Formats "Syntax Error" message.
 */
export function formatSyntaxError(message: string): string {
  const messageByLine = message.split("\n");
  const padding = getLinePadding(messageByLine[0]);
  const filePath = removeLinePadding(padding, messageByLine[0]);
  const error = removeLinePadding(
    padding,
    messageByLine[1].replace(
      "Module build failed: SyntaxError:",
      SYNTAX_ERROR_LABEL_HUMAN_FRIENDLY
    )
  );
  const snippet = messageByLine
    .filter(isFileSnippetLine)
    .map(removeLinePadding.bind(null, padding));

  return `${chalk.red("Error:")}

${chalk.dim("|")}  ${error}

${chalk.yellow("Where:")} ${filePath}

${snippet.join("\n")}`;
}

/**
 * Formats "ESLint warning" message.
 */
export function formatEslintWarning(message: string): string {
  const messageByLine = message.split("\n");
  const padding = getLinePadding(messageByLine[0]);
  const filePath = removeLinePadding(padding, messageByLine[0]);
  const rule = messageByLine
    .filter(isEslintWarningRuleLine)
    .map(removeLinePadding.bind(null, padding + 2));

  return `${rule.join("\n")}

${chalk.yellow("Where:")} ${filePath}`;
}

/**
 * Beautifies error messages and warnings.
 */
export function formatMessages(messages: string[]): string[] {
  return findMessagesToFormat(messages).map(message => {
    if (isSyntaxError(message)) {
      return formatSyntaxError(message);
    }

    if (isEslintWarning(message)) {
      return formatEslintWarning(message);
    }

    return message;
  });
}
