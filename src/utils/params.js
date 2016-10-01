/* @flow */

import path from 'path';
import getTemplatePath from './get-template-path';

/**
 * Params for Aik
 */
export default function params(filename: string, flags: CLIFlags, ngrok: string | false, isProd: boolean) : AikParams {
  const template = getTemplatePath(filename);
  const distShortName = typeof flags.build === 'string' ? flags.build : 'dist';

  return {
    isProd,
    ngrok: ngrok || '',
    template: {
      path: template,
      short: path.relative(process.cwd(), template)
    },
    dist: {
      path: path.join(process.cwd(), distShortName),
      short: distShortName
    }
  };
}
