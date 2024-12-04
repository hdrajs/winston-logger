import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import * as util from "util";
import { LoggerOptions } from "./type";
import { configs } from "./config";

export type { LoggerOptions } from "./type";
export class Logger {
  private logger;
  private transports: winston.transport[] = [];

  constructor(
    private readonly context: string = Logger.name,
    private options?: LoggerOptions
  ) {
    if (!winston.loggers.has(this.context)) {
      this.initTransports();
      winston.loggers.add(this.context, {
        format: winston.format.combine(
          this.enumerateErrorFormat(),
          winston.format.splat(),
          winston.format.colorize({
            colors: configs.colors,
            all: true,
          }),
          winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
          }),
          this.logFormat
        ),
        levels: configs.levels,
        transports: this.transports,
      });
    }
    this.logger = winston.loggers.get(this.context);
  }

  private initTransports() {
    this.transports.push(
      new winston.transports.Console({
        level: "SUCCESS",
        handleExceptions: true,
      })
    );
    if (this.options?.file) {
      this.transports.push(
        new winstonDaily({
          datePattern: "YYYY-MM-DD",
          filename: `%DATE%.log`,
          maxFiles: 30,
          handleExceptions: true,
          json: false,
          zippedArchive: true,
        })
      );
    }
  }

  private logFormat = winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...extra } = info;
    const icon = configs.icons[String(info.level)] || "";
    const extraDetails = Object.keys(extra).length ? util.inspect(extra) : "";
    const stackTrace = stack ? `\nStack Trace:\n${stack}` : "";
    return `[${timestamp}] ${icon} ${level} [${this.context}]: ${message}${extraDetails}${stackTrace}`;
  });

  private enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
      info.message = `[${info.name}] ${info.message}`;
      info.level = info.name;
    }
    return info;
  });

  log(msg: any) {
    return this.logger.INFO(msg);
  }
  debug(msg: any) {
    return this.logger.DEBUG(msg);
  }
  warn(msg: any) {
    return this.logger.WARN(msg);
  }
  error(msg: any, error?: Error) {
    return this.logger.ERROR(error && msg ? `${msg} \n${error}` : error ?? msg);
  }
  verbose(msg: any, error?: Error) {
    return this.logger.VERBOSE(
      error && msg ? `${msg} \n${error}` : error ?? msg
    );
  }
  success?(msg: any) {
    return this.logger.SUCCESS(msg);
  }
}
