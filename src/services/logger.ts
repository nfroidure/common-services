import { constant, location } from 'knifecycle';
import { info, error, debug } from 'node:console';
import { type Logger } from './log.js';

export const DEFAULT_LOGGER = {
  output: info,
  error,
  debug,
} as Logger;

export default location(constant('logger', DEFAULT_LOGGER), import.meta.url);
