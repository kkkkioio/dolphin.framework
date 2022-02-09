import { CharaCreate } from "./CharaCreate";

CharaCreate.getInstance();
class CharaInk extends inkbox.Ink{
    inkName:string = "CharaInk";
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
Ink["ctor"] = CharaInk;