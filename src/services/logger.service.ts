import { Injectable, LoggerService, Scope } from '@nestjs/common';
import 'winston-daily-rotate-file';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';



/** ===============================================
 * JYLib_LoggerService
 * 
 * Creates log file every day and stores them in /logs directory
 * Also supports querying log files through query function.
 * Ref: https://docs.nestjs.com/techniques/logger, https://www.npmjs.com/package/winston-daily-rotate-file
 * Ref: https://github.com/winstonjs/winston
 * Ref: https://github.com/gremo/nest-winston
 */
@Injectable({ scope: Scope.TRANSIENT })

export class JYLib_LoggerService implements LoggerService {
  public logger: LoggerService;  // nestjs/common/LoggerService
  public loggerLabel: string = ''; // Label appears in each log line

  constructor(appName: string) {
    //var pkgJson = require(`${process.env.PWD}/package.json`);
    //const appName = `${pkgJson.name || 'app'}`;
    const logPrefixName = appName;

    this.logger = WinstonModule.createLogger({
      level: 'info',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        winston.format.printf(({ level, message, label, timestamp }) => {
          return JSON.stringify({ t: timestamp,
                                  lbl: label,
                                  lvl: level, 
                                  msg: message});
        })
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          level: 'debug',
          filename: `${logPrefixName}_%DATE%.log.ansi`,
          dirname: 'logs',
          //datePattern: 'YYYY-MM-DD' this is default and determines frequency as well
          handleExceptions: true,
          json: true,
          maxFiles: '30d',
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, label, timestamp, stack, trace }) => {
                return `${timestamp} [${label}] ${level}: ${message} ${stack ? stack : ''
                  } ${trace ? trace : ''}`;
              },
            ),
          )
        }),
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, label, timestamp, stack, trace }) => {
                return `${timestamp} [${label}] ${level}: ${message} ${stack ? stack : ''
                  } ${trace ? trace : ''}`;
              },
            ),
          ),
        }),
      ],
    });

    // throw unhandledRejctions as exceptions
    // For unknown reason, this will get printed out twice
    process.on('unhandledRejection', err => {
      throw err;
    });
  }

  log(message: any, label = this.loggerLabel): any {
    this.logger.log({
      message: message,
      label: label
    });
  }

  error(message: any, trace?: string, label = this.loggerLabel): any {
    this.logger.error({
      message: message,
      label: label,
      trace: trace
    });
  }

  warn(message: any, label = this.loggerLabel): any {
    this.logger.warn({
      message: message,
      label: label
    });
  }

  debug(message: any, label = this.loggerLabel): any {
    this.logger.debug({
      message: message,
      label: label
    });
  }

  verbose(message: any, label = this.loggerLabel): any {
    this.logger.verbose({
      message: message,
      label: label
    });
  }
}