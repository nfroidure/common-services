import { constant } from 'knifecycle';
import { info, error, debug } from 'node:console';
import { type Logger } from './log.js';

export const DEFAULT_LOGGER = {
  output: info,
  error,
  debug,
} as Logger;

export default constant('logger', DEFAULT_LOGGER);
