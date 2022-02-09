import { getInstance,Singleton } from "./Singleton";
import { Config } from "./config";
import { EventManager } from "./EventManager";

class DolphinInk extends inkbox.Ink{
    inkName:string = "DolphinInk";
    start():number {
        Config.getInstance().load();
        return 0;
    }
}

export function errorCode(code:string){
    let caller_line = (new Error).stack.split("\n")[4];
    return {
        "file":caller_line,
        "code":code
    }
}

//注册导出模块
export class Ink{
     
} 
Ink["Singleton"] = Singleton;
Ink["getInstance"] = getInstance;
Ink["EventManager"] = EventManager;
Ink["Config"] = Config;
Ink["ERROR_CODE"] = errorCode;
Ink["ctor"] = DolphinInk;
