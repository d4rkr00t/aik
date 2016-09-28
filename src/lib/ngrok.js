/* @flow */

import ngrok from 'ngrok';

/**
 * Creates ngrok tunnel.
 */
export default function createNgrokTunnel(flags:CLIFlags) : Promise<string> {
  if (flags.host !== 'localhost') {
    return Promise.reject(new Error('Ngrok can`t be used with host option.'));
  }

  return new Promise((resolve, reject) => {
    ngrok.connect(flags.port, (err, url) => {
      if (err) return reject(err);

      resolve(url.replace('https:', 'http:'));
    });
  });
}
