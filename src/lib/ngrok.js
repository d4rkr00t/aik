import ngrok from 'ngrok';

/**
 * Creates ngrok tunnel.
 *
 * @param {Flags} flags
 *
 * @return {Promise}
 */
export default function createNgrokTunnel(flags) {
  return new Promise((resolve, reject) => {
    ngrok.connect(flags.port, (err, url) => {
      if (err) {
        return reject(err);
      }

      resolve(url.replace('https:', 'http:'));
    });
  });
}
