export class ClockInk extends inkbox.Ink{
    inkName:string = "ClockInk";
    private m_current:number;
    private m_millisecond:number;
    private m_tailMillisecond:number;
    private static s_instance:ClockInk;
    static getInstance():ClockInk{
        return ClockInk.s_instance;
    }
    constructor(){
        super()
        this.m_millisecond = this.m_tailMillisecond = 0;
        this.setTime();
    }
    start():number{
        ClockInk.s_instance = this;
        return 0;
    }
    shouldCallRun():boolean {
       return true;
    }
    getTimeMS():number{
        return this.m_current;
    }
    getMilliSeconds():number{
        return this.m_millisecond;
    }
    setTime(){
        this.m_current = new Date().getTime();
        let up = this.m_current - this.m_tailMillisecond;
        this.m_millisecond += up;
    }
    run(){
        this.setTime();
    }
}

//注册导出模块
export class Ink{
     
} 
// Ink["Singleton"] = Singleton;
// Ink["getInstance"] = getInstance;
// Ink["Config"] = Config;
Ink["ctor"] = ClockInk;
Ink["ClockInk"] = ClockInk;
