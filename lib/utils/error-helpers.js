'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLikelyASyntaxError = isLikelyASyntaxError;
exports.formatMessage = formatMessage;
const SYNTAX_ERROR_LABEL = 'SyntaxError:';
const SYNTAX_ERROR_LABEL_HUMAN_FRIENDLY = 'Syntax Error:';

/**
 * Checks whether error is syntax error.
 */
function isLikelyASyntaxError(message) {
  return message.indexOf(SYNTAX_ERROR_LABEL) !== -1 || message.indexOf(SYNTAX_ERROR_LABEL_HUMAN_FRIENDLY) !== -1;
}

/**
 * Makes some common errors shorter.
 */
function formatMessage(message) {
  return message
  // Babel syntax error
  .replace('Module build failed: SyntaxError:', SYNTAX_ERROR_LABEL_HUMAN_FRIENDLY)
  // Webpack file not found error
  .replace(/Module not found: Error: Cannot resolve 'file' or 'directory'/, 'Module not found:')
  // Internal stacks are generally useless so we strip them
  .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
  // Webpack loader names obscure CSS filenames
  .replace('./~/css-loader!./~/postcss-loader!', '');
}