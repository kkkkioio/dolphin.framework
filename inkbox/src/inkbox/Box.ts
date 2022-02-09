import { Ink } from "./Ink";

export class Box{
    inkPath = "./";
    private m_inks:Map<string,Ink> = new Map();

    static s_instance:Box;
    static getInstance():Box{
        if(Box.s_instance == null){
            Box.s_instance = new Box(); 
        }
        return Box.s_instance;
    }

    loadInk(name:string){
        let mdl = require(this.inkPath + name);
        if(this.m_inks.has(name)){
            // console.log("already loaded ink " + name);
            return;
        }
        // console.log(mdl.Ink.ctor)
        let ink:Ink = new mdl.Ink.ctor();
        if(ink.start() != 0 ){
            console.log("load ink failed " + name);
            return;
        }
        // console.log(ink);
        this.m_inks.set(name,ink);
        Object.defineProperty(globalThis, name, { value: mdl.Ink });   
        console.log("load ink sucess " + name);
    }
    boxRun():boolean
    {
        for (const ink of this.m_inks.values()) {
            if(!ink.shouldCallRun()){
                continue;
            }
            // console.log(222222222222222);
            ink.run();
        }
        return true;
    }
}