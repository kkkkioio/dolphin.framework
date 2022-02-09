import { JsonHandler } from "./JsonHandler";
import { JsonHandlerContext } from "./JsonHandlerContext";
import { JsonSender } from "./JsonSender";
import { WebStartedEvent } from "./WebStartedEvent";

// class TestHandle extends JsonHandler{
//     getUrl(): string {
//         return "test";
//     }
//     onRequest(context: JsonHandlerContext): void {
//         throw new Error("Method not implemented.");
//     }
//     getLoadFields(request: any): any {
//         return {
//             // "c.nickname":1
//         }
//     }
//     getModuleName(): string {
//         return 'TestHandle';
//     }
// }

class WebInk extends inkbox.Ink{
    inkName:string = "WebInk";
    start():number {
        let host = iDolphin.Config.getInstance().get('WebHost');
        let port = iDolphin.Config.getInstance().get('WebPort');
        iHttp.HttpServer.getInstance().config(host,port,()=>{
            let event:WebStartedEvent = new WebStartedEvent();
            event.host = host;
            event.port = port;
            iDolphin.EventManager.getInstance().raiseEvent(event);
        });
        let code = iService.Service.getInstance().start();
		if (code){
            //log
            // console.log(code)
			return -1;
        }
        return 0;
    }
}
//注册导出模块
export class Ink{
     
} 
Ink["ctor"] = WebInk;
Ink["JsonHandler"] = JsonHandler;
Ink["JsonSender"] = JsonSender;
Ink["JsonHandlerContext"] = JsonHandlerContext;
Ink["WebStartedEvent"] = WebStartedEvent;
