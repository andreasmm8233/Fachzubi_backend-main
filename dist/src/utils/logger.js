"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
class Logger {
    logger;
    constructor(logFilePath = "logs/") {
        this.logger = winston_1.default.createLogger({
            level: "info",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => {
                const formattedMessage = `${timestamp} [${level}]: ${message}`;
                return level === "error"
                    ? chalk_1.default.red(formattedMessage)
                    : level === "warn"
                        ? chalk_1.default.yellow(formattedMessage)
                        : level === "info"
                            ? chalk_1.default.green(formattedMessage)
                            : level === "debug"
                                ? chalk_1.default.blue(formattedMessage)
                                : formattedMessage;
            })),
            transports: [
                new winston_1.default.transports.Console(),
                new winston_daily_rotate_file_1.default({
                    filename: `${logFilePath}/app-%DATE%.log`,
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                }),
                new winston_daily_rotate_file_1.default({
                    filename: `${logFilePath}/error-%DATE%.log`,
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    level: "error",
                    maxFiles: "14d",
                }),
            ],
        });
    }
    formatArg(arg) {
        return JSON.stringify(arg);
    }
    info(...args) {
        const message = args.map(this.formatArg).join(" ");
        this.logger.info(message);
    }
    warn(...args) {
        const message = args.map(this.formatArg).join(" ");
        this.logger.warn(message);
    }
    error(...args) {
        const message = args.map(this.formatArg).join(" ");
        this.logger.error(message);
    }
    debug(...args) {
        const message = args.map(this.formatArg).join(" ");
        this.logger.debug(message);
    }
}
const logger = new Logger();
exports.default = logger;
//# sourceMappingURL=logger.js.map