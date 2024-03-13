import { Injectable, LoggerService, Scope } from '@nestjs/common';
import 'winston-daily-rotate-file';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

function getLogService(me: any, msg?: string, loggerService?: JYLib_LoggerService): JYLib_LoggerService {
  if (loggerService == undefined) {
    loggerService = me.loggerService;
  }

  if (loggerService == undefined) {
    console.warn(`No Log Service Ref: ${me?.constructor?.name?.toString()}: ${msg}`);
  }
  return loggerService;
}

/** ===============================================
 * JYLib_LoggerService
 * 
 * Creates log file every day and stores them in /logs directory
 * Also supports querying log files through query function.
 * Ref: https://docs.nestjs.com/techniques/logger, https://www.npmjs.com/package/winston-daily-rotate-file
 * Ref: https://github.com/winstonjs/winston
 * Ref: https://github.com/gremo/nest-winston
 * 
 * NOTE: It is preferable to use LOG_XXX macro to write log.
 */

export const LOG_ERROR = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) {
  const logger: JYLib_LoggerService = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    logger.write(caller, msg, trace, 'error');
  }
};

export const LOG_WARN = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) {
  const logger: JYLib_LoggerService = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    logger.write(caller, msg, trace,  'warn');
  }
};

export const LOG_INFO = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) {
  const logger: JYLib_LoggerService = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    logger.write(caller, msg, trace,  'info');
  }
};

export const LOG_VERBOSE = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) {
  const logger: JYLib_LoggerService = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    logger.write(caller, msg, trace,  'verbose');
  }
};

export const LOG_DEBUG = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) {
  const logger: JYLib_LoggerService = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    logger.write(caller, msg, trace,  'debug');
  }
};

@Injectable({ scope: Scope.TRANSIENT })
export class JYLib_LoggerService implements LoggerService {
  public logger: LoggerService;  // nestjs/common/LoggerService
  public appName: string = '';

  constructor(appName: string, logLevel: |'error'|'warn'|'info'|'verbose'|'debug'  = 'info') {
    this.appName = appName;

    const logPrefixName = appName;
    
    // Set logger label from appName for now.
    this.logger = WinstonModule.createLogger({
      level: logLevel,
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
          level: logLevel,
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
          level: logLevel,
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

  log(message: any, trace?: string, label: string=this.appName): any {
    this.logger.log({ message: message, label: label, trace: trace });
  }

  error(message: any, trace?: string, label: string=this.appName): any {
    this.logger.error({ message: message, label: label, trace: trace });
  }

  warn(message: any, trace?: string, label: string=this.appName): any {
    this.logger.warn({ message: message, label: label, trace: trace });
  }

  debug(message: any, trace?: string, label: string=this.appName): any {
    this.logger.debug({ message: message, label: label, trace: trace });
  }

  verbose(message: any, trace?: string, label: string=this.appName): any {
    this.logger.verbose({ message: message, label: label, trace: trace });
  }

  /**
   * Writes log
   * @param caller
   * @param [message]
   * @param [trace] 
   * @param [logLevel] 
   */
  public write(caller: any, message?: string, trace?: any, logLevel: 'fatal'|'error'|'warn'|'info'|'verbose'|'debug'  = 'info') {
    let label = `${this.appName}`;
    let subLabel = `${(caller != undefined) ? "["+caller.constructor.name.toString()+"]: " : ''}`

    message = `${subLabel}${message}`;

    switch (logLevel) {
      case 'fatal':
        this.logger.fatal({message, label, trace}); break;
      case 'error':
        this.logger.error({message, label, trace}); break;
      case 'warn':
        this.logger.warn({message, label, trace}); break;
      case 'debug':
        this.logger.verbose({message, label, trace}); break;
      case 'verbose':
        this.logger.debug({message, label, trace}); break;
      case 'info':
      default:
        this.logger.log({message, label, trace}); break;
    }
  }
}