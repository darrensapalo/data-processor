import winston, {format} from 'winston';

export const log = (filename: string, minimumLogLevel: string = 'info') => {
  let log = winston.createLogger({
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
        filename: filename,
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
