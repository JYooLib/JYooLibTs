// Ref: https://docs.nestjs.com/techniques/logger, https://www.npmjs.com/package/winston-daily-rotate-file

import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { Logger } from 'winston';
import 'winston-daily-rotate-file';
import * as winston from 'winston';

/**
 * Creates log file every day and stores them in /logs directory
 * Also supports querying log files through query function.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LogService implements LoggerService {
  private logger: Logger;
  private loggerLabel: string

  public setLabel(label: string) {
    this.loggerLabel = label;
  }

  constructor() {
    var pkgJson = require(`${process.env.PWD}/package.json`);
    const appName = `${pkgJson.name || 'app'}`;
    const logPrefixName = appName;

    this.logger = winston.createLogger({
      // Reference
      // https://github.com/winstonjs/winston
      // https://github.com/gremo/nest-winston
      level: 'info',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        winston.format.printf(({ level, message, label, timestamp }) => {
          return JSON.stringify({t: timestamp,
                                 lbl: label,
                                 lvl: level, 
                                 msg: message});
        })
      ),
      transports: [
        // Reference
        // https://medium.com/@akshaypawar911/how-to-use-winston-daily-rotate-file-logger-in-nodejs-1e1996d2d38
        new winston.transports.DailyRotateFile({
          level: 'debug',
          filename: `${logPrefixName}_%DATE%.log`,
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
    this.logger.info({
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

  info(message: any, label = this.loggerLabel): any {
    this.logger.info({
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