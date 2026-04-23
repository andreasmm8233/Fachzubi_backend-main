declare class Logger {
    private readonly logger;
    constructor(logFilePath?: string);
    private formatArg;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
}
declare const logger: Logger;
export default logger;
