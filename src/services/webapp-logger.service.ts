import { Inject, Injectable, InjectionToken } from '@angular/core';

function getLogService(me: any, msg?: string, loggerService?: JYLib_WebAppLoggerService): JYLib_WebAppLoggerService | undefined {
  if (loggerService == undefined) {
    loggerService = me.loggerService;
  }

  if (loggerService == undefined) {
    console.warn(`No Log Service Ref: ${me?.constructor?.name?.toString()}: ${msg}`);
  } 
  
  return loggerService;
}

/** ===============================================
 * JYLib_WebAppLoggerService
 * 
 * Creates log file every day and stores them in /logs directory
 * Also supports querying log files through query function.
 * Ref: https://docs.nestjs.com/techniques/logger, https://www.npmjs.com/package/winston-daily-rotate-file
 * Ref: https://github.com/winstonjs/winston
 * Ref: https://github.com/gremo/nest-winston
 * 
 * NOTE: It is preferable to use LOG_XXX macro to write log.
 */

export const LOG_ERROR = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_WebAppLoggerService) {
  const logger = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    if (trace === undefined) {
      trace = new Error().stack;
    }
    logger.write(caller, msg, trace, 'error');
  }
};

export const LOG_WARN = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_WebAppLoggerService) {
  const logger = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    logger.write(caller, msg, trace,  'warn');
  }
};

export const LOG_INFO = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_WebAppLoggerService) {
  const logger = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    if (logger.logLevel === 'verbose' || logger.logLevel === 'debug' || logger.logLevel === 'info') {
      // LogLevel filter: passed
    } else {
      // LogLevel filter: blocked
    }
    logger.write(caller, msg, trace,  'info');
  }
};

export const LOG_VERBOSE = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_WebAppLoggerService) {
  const logger = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    if (logger.logLevel === 'verbose' || logger.logLevel === 'debug') {
      // LogLevel filter: passed
    } else {
      // LogLevel filter: blocked
    }
    logger.write(caller, msg, trace,  'verbose');
  }
};

export const LOG_DEBUG = function (caller: any, msg?: string, trace?: any, loggerService?: JYLib_WebAppLoggerService) {
  const logger = getLogService(caller, msg, loggerService);
  if (logger !== undefined) {
    if (logger.logLevel === 'verbose' || logger.logLevel === 'debug') {
      // LogLevel filter: passed
    } else {
      // LogLevel filter: blocked
    }

    logger.write(caller, msg, trace,  'debug');
  }
};

// Injection Tokens
const APP_NAME = new InjectionToken<string>('webapp');
const LOG_LEVEL = new InjectionToken<'error' | 'warn' | 'info' | 'verbose' | 'debug'>('logLevel');


@Injectable({
  providedIn: 'root',
})
export class JYLib_WebAppLoggerService {
  private m_appName: string = '';
  private m_logLevel: string = 'debug';

  /**
   * Creates an instance of jylib logger service.
   * @param appName 
   * @param [logLevel] 
   * @param [logsPath] 
   * @param [maxFiles] 
   */
  constructor(
    @Inject(APP_NAME) appName: string = '',
    @Inject(LOG_LEVEL) logLevel: |'error'|'warn'|'info'|'verbose'|'debug'  = 'info') {
    this.m_appName = appName;
    this.m_logLevel = logLevel;
    /*
    const logPrefixName = appName;
    
    // Set logger label from appName for now.
    this.logger = winston.createLogger({
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
    });*/
  }

  get appName(): string {
    return this.m_appName;
  }

  get logLevel(): string {
    return this.m_logLevel;
  }

  public init() {}
  
  /**
   * Writes log
   * @param caller
   * @param [message]
   * @param [trace] 
   * @param [logLevel] 
   */
  public write(caller: any, message?: string, trace?: any, logLevel: 'fatal'|'error'|'warn'|'info'|'verbose'|'debug'  = 'info') {
    let label = `${this.m_appName}`;
    let subLabel = `${(caller != undefined) ? "["+caller.constructor.name.toString()+"]: " : ''}`


    let msgStr: string = `${new Date().toISOString()}: [${label}]: ${subLabel}${message}`;

    switch (logLevel) {
      case 'error':
        msgStr = `${msgStr}\ntrace: ${trace}`;
        console.error(msgStr); break;
      case 'warn':
        console.warn(msgStr);break;
      case 'debug':
        console.debug(msgStr); break;
      case 'verbose':
        console.log(msgStr); break;
      case 'info':
      default:
        console.info(msgStr); break;
    }
  }
}