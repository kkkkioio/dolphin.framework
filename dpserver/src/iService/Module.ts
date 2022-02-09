import { Service } from "./Service";

export abstract class Module<T> extends iDolphin.Singleton{
    private m_started:boolean = false;
    private m_refs:number;
    isStarted():boolean{
        return this.m_started;
    }
    addRef(){
        ++this.m_refs;
    };
    releaseRef(){
        --this.m_refs;
    };
    abstract getModuleName():string;
    checkStart():boolean{
        return true;
    }
    checkStop():boolean{
        return this.m_refs == 0;
    }
    constructor(){
        super();
        this.m_refs = 0;
        Service.getInstance().registModule(
            this,
            this.initial,
            this.start,
            this.run,
            this.stop,
            this.getModuleName()
        )
    }
    initial():number{
        return 0;
    }
    start():number{
        if(!this.checkStart()){
            return -1;
        }
        this.m_started = true;
        return 0;
    }
    run():number{
        return 0;
    }
    stop():number{
        if(this.isStarted()){
            if(!this.checkStop()){
                return -1;
            }
        }
        return 0;
    }
}