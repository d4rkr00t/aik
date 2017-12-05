/* @flow */

export class AikError extends Error {
  formattedMessage: Array<string>;

  constructor(msg: string, formattedMessage: Array<string>) {
    super(msg);
    this.formattedMessage = formattedMessage;
  }
}
