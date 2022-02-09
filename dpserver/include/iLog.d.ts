declare module iLog {
    declare enum LogType {
        Error = 0,
        Assert = 1,
        Warning = 2,
        Log = 3,
        Exception = 4
    }
    declare class Log extends iDolphin.Singleton {
        LOG_OBJECT_TO_JSON(...args: any[]): boolean;
        getPrintStack(type: LogType, showStack: boolean, ...args: any[]): string;
        log(...args: any[]): void;
    }
}