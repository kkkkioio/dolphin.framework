import { Login } from "./Login";
//模块注册
Login.getInstance();
class LoginInk extends inkbox.Ink{
    inkName:string = "LoginInk";
    start():number {
        // TestHandle.getInstance();
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
Ink["ctor"] = LoginInk;
