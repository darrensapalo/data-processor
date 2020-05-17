import winston, {format} from 'winston';
import path from 'path';

/**
 * Creates a new logger that creates a log file at the `logs` folder with the
 * specified file name.
 * @param filename
 * @param minimumLogLevel
 */
export function createLogger(filename: string, minimumLogLevel: string = 'info') {
  const log = winston.createLogger({
    level: 'info',
    format: format.combine(
      winston.format.json(),
      winston.format.colorize()
    ),
    defaultMeta: undefined, // { service: 'rapidpass-bulk-data-processor-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({
        filename: path.resolve('logs', filename),
        level: minimumLogLevel
      })
    ]
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    log.add(new winston.transports.Console({
      level: 'info',
      format: winston.format.simple()
    }));
  }
  return log;
}
