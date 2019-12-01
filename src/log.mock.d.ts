declare const _default: ({
  LOG_ROUTING,
  logger,
  debug,
}: {
  LOG_ROUTING?: {
    [type: string]: import('./log').StdStream;
  };
  logger?: import('./log').Logger;
  debug?: import('./log').LogService;
}) => Promise<(type: string, ...args: any[]) => void>;
export default _default;
