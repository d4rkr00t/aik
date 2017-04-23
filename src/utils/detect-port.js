/* @flow */
import net from "net";

export function tryPort(port: number, host: string): Promise<number> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.on("error", () => {
      server.close();
      resolve(tryPort(++port, host));
    });

    server.listen({ port, host }, () => {
      port = server.address().port;
      server.close();
      resolve(port);
    });
  });
}

export default function detectPort(
  port: number,
  host: string = "localhost"
): Promise<number> {
  return tryPort(port, host);
}
