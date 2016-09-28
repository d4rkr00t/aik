/* @flow */

import path from 'path';
import { getTemplatePath } from './webpack/config/helpers';

/**
 * Params for Aik
 */
export default function params(filename:string, flags:CLIFlags, ngrok:string|false, isProd:boolean) : AikParams {
  const template = getTemplatePath(filename);
  const distShortName = typeof flags.build === 'string' ? flags.build : 'dist';
  const dist = path.join(process.cwd(), distShortName);

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
  }
}
