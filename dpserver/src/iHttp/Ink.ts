import { HttpServer } from "./HttpServer";
import { ServerStartedEvent } from "./ServerStartedEvent";
//后续分离用
let s_depends = [
    "iLog",
    "iDolphin",
    "iService"
]
for (const depend of s_depends) {
    inkbox.Box.getInstance().loadInk(depend);
}
HttpServer.getInstance();
class HttpInk extends inkbox.Ink{
    inkName:string = "HttpInk";
    start():number {
        return 0;
    }
}
//注册导出模块
export class Ink{
    
} 
Ink["ctor"] = HttpInk
Ink["HttpServer"] = HttpServer
Ink["ServerStartedEvent"] = ServerStartedEvent