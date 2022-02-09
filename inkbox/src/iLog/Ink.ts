import { Log } from "./Log";
//后续分离用
let s_depends = [
    "iDolphin"
]
for (const depend of s_depends) {
    inkbox.Box.getInstance().loadInk(depend);
}

class LogInk extends inkbox.Ink{
    inkName:string = "LogInk";
}
//注册导出模块
export class Ink{
     
} 
Ink["Log"] = Log;
Ink["ctor"] = LogInk
// let log = iDolphin.getInstance(Log)
// log.log(111111)
// WebAPI