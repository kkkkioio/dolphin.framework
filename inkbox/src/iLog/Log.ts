enum LogType {
	Error = 0,
	Assert = 1,
	Warning = 2,
	Log = 3,
	Exception = 4
}
export class Log extends iDolphin.Singleton{
    LOG_OBJECT_TO_JSON(...args:any[]): boolean{
        return false;
    }
    getPrintStack(type: LogType, showStack : boolean, ...args:any[]):string {
        let message = '';
        for (let i = 0; i < args.length; i++) {
            const element = args[i];
            if (typeof element === 'object' && this.LOG_OBJECT_TO_JSON) {
                message += JSON.stringify(element);
            } 
            else {
                message += element;
            }
            if (i < args.length - 1) {
                message += ' ';
            }
        }
    
        if (showStack) {
            var stacks = new Error().stack!.split('\n');
            for (let i = 3; i < stacks.length; i++) {
                const line = stacks[i];
                message += '\n';
                message += line;
            }
        }
        return message;
    }
    log(...args:any[]): void{
        let msg = this.getPrintStack(LogType.Log, false, args);
        console.log(msg);
    }
    logWarn(...args:any[]): void{
        let msg = this.getPrintStack(LogType.Warning, false, args);
        console.log(msg);
    }
    logError(...args:any[]): void{
        let msg = this.getPrintStack(LogType.Error, false, args);
        console.log(msg);
    }
}