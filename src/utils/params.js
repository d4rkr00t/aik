/* @flow */

import path from "path";
import getTemplatePath from "./get-template-path";
import { getBabelrc } from "./babelrc";
import { detectFramework } from "./framework-detectors";
import detectPort from "./detect-port";
import createNgrokTunnel from "./ngrok";

/**
 * Updates port if specified one has already been taken
 */
export async function updatePort(
  port: string | number,
  host: string
): Promise<{ port: string | number, oldPort?: string | number }> {
  const newPort = await detectPort(parseInt(port, 10), host);

  if (port !== newPort) {
    return { oldPort: port, port: newPort };
  }

  return { port };
}

/**
 * Params for Aik
 */
export default async function createParams({
  filename,
  flags,
  isProd
}: {
  filename: string,
  flags: CLIFlags,
  isProd: boolean
}): Promise<AikParams> {
  const template = getTemplatePath(filename);
  const distShortName = typeof flags.build === "string" ? flags.build : "dist";
  const host = !flags.host || flags.host === "::" ? "localhost" : flags.host;
  const port = await updatePort(flags.port || 4444, host);
  const framework = flags.react ? "react" : detectFramework(filename);
  const ngrok = flags.ngrok && !isProd && (await createNgrokTunnel({ port: port.port, host }));
  const babelrc = getBabelrc(filename);

  const params: AikParams = {
    filename,
    framework,

    isProd,
    open: flags.open,

    base: flags.base ? flags.base.toString() : "",
    ngrok: ngrok || "",

    host,
    port: port.port,
    oldPort: port.oldPort,

    babelrc,

    template: {
      path: template,
      short: path.relative(process.cwd(), template)
    },

    dist: {
      path: path.join(process.cwd(), distShortName),
      short: distShortName
    }
  };

  return params;
}
