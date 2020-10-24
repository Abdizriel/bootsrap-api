/* eslint-disable @typescript-eslint/no-explicit-any */

import winston from 'winston'

export class AppLogger {
  public static service: string
  private static logger: winston.Logger

  public static create(service: string): void {
    AppLogger.service = service

    if (process.env.NODE_ENV !== 'production') {
      const loggingConsole = new winston.transports.Console()

      AppLogger.logger = winston.createLogger({
        level: 'debug',
        transports: [loggingConsole],
      })
    } else {
      const loggingConsole = new winston.transports.Console()

      AppLogger.logger = winston.createLogger({
        level: 'debug',
        transports: [loggingConsole],
      })
    }
  }

  public static debug(
    message: any,
    meta?: { httpRequest?: any; labels?: any; [key: string]: any },
  ): void {
    AppLogger.logger.debug(message, meta)
  }

  public static info(message: any, meta?: { httpRequest?: any; labels?: any }): void {
    AppLogger.logger.info(message, meta)
  }

  public static warning(
    message: any,
    meta?: { httpRequest?: any; labels?: any; jsonPayload?: any },
  ): void {
    AppLogger.logger.warn(message, meta)
  }

  public static error(
    message: any,
    meta?: { httpRequest?: any; labels?: any; jsonPayload?: any },
  ): void {
    AppLogger.logger.error(message, meta)
  }
}
