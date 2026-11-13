/**
 * Interface that allows to use log statements from frontend and backend code (logs to console when used from frontend, to log file when used
 * from backend)
 */
export interface ILogger {
  error(msg: string): void;
  warn(msg: string): void;
  info(msg: string): void;
  debug(msg: string): void;
}

let logger: ILogger | undefined;

export function registerLogger(pLogger: ILogger): void {
  logger = pLogger;
}

export function getLogger(): ILogger | undefined {
  return logger;
}

if (typeof window !== "undefined") {
  const consoleLogger: ILogger = {
    error: (msg) => console.error(msg),
    warn: (msg) => console.warn(msg),
    info: (msg) => console.info(msg),
    debug: (msg) => console.debug(msg),
  };
  registerLogger(consoleLogger);
}
