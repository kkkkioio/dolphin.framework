import { Module } from "./Module";
import { Service } from "./Service";
//后续分离用
let s_depends = [
    "iDolphin",
    "iLog"
 ]
 for (const depend of s_depends) {
    inkbox.Box.getInstance().loadInk(depend);
 }
class ServiceInk extends inkbox.Ink{
    inkName:string = "ServiceInk";
    start():number {
        let code = Service.getInstance().start();
        if(code){
            iLog.Log.getInstance().log("Can't start service:" + code);
            return 1;
        }
        return 0;
    }
    shouldCallRun():boolean{
        return true;
    }
    run(){
        Service.getInstance().runOnce();
    }
}

//注册导出模块
export class Ink{
     
} 
Ink["Module"] = Module;
Ink["Service"] = Service;
Ink["ctor"] = ServiceInk;