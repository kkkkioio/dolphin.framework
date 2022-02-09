import { GameServerBank } from "./GameServerBank";

GameServerBank.getInstance();
class ServerInk extends inkbox.Ink{
    inkName:string = "ServerInk";
    start():number {
        let code = iService.Service.getInstance().start();
		if (code){
			return -1;
		}
        return 0;
    }
    saveServer(){
        
    }
}
//注册导出模块
export class Ink{
     
} 
Ink["ctor"] = ServerInk;