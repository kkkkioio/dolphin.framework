import { AsyncCallBack } from "./AsyncCallBack";

class CoreInk extends inkbox.Ink{
    inkName:string = "CoreInk";
    start():number {
        let code = iService.Service.getInstance().start();
		if (code){
			return -1;
		}
       return 0;
    }
}
//注册导出模块
export class Ink{
     
} 
Ink["ctor"] = CoreInk;
Ink["AsyncCallBack"] = AsyncCallBack