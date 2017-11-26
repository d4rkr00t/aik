/* @flow */

import ngrok from "ngrok";

/**
 * Creates ngrok tunnel.
 */
export default function createNgrokTunnel({ host, port }: { host: string, port: string | number }): Promise<string> {
  if (host !== "localhost") {
    return Promise.reject(new Error("Ngrok can`t be used with host option."));
  }

  return new Promise((resolve, reject) => {
    ngrok.connect(port, (err, url) => {
      if (err) return reject(err);

      resolve(url.replace("https:", "http:"));
    });
  });
}
