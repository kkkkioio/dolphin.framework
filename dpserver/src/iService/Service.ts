import { MODULE_RUNTIME, RunTimeMonitor } from "./RunTimeMonitor";

interface ModuleFunction
{
    name:string;
    context:any;
    func:Function;
}

export class Service extends iDolphin.Singleton{
    //!< 模块初始集合
    private m_initialFuncsOrigin:ModuleFunction[] = [];   
    private m_startFuncsOrigin:ModuleFunction[] = [];     
    private m_runFuncsOrigin:ModuleFunction[] = [];       
    private m_stopFuncsOrigin:ModuleFunction[] = [];      
    //!< 模块集合
    private m_initialFuncs:ModuleFunction[] = [];
    private m_startFuncs:ModuleFunction[] = [];
    private m_runFuncs:ModuleFunction[] = [];
    private m_stopFuncs:ModuleFunction[] = [];
    //!< 已启动模块集合
    private m_initialedFuncs:ModuleFunction[] = [];
    private m_startedFuncs:ModuleFunction[] = [];
    private m_moduleRunExitCode:number = 0;
    /**
     * 
     * @param context 
     * @param initial 
     * @param start 
     * @param run 
     * @param stop 
     * @param name 
     */
    registModule(
        context:any,				//!< 模块对象指针
        initial:Function,           //!< 开始函数
        start:Function,	            //!< 开始函数
        run:Function,		        //!< 运行函数
        stop:Function,		        //!< 停止函数
        name:string			        //!< 模块名称
    ){
        if(initial){
            let item:ModuleFunction ={
                name:name,
                func:initial,
                context:context
            }
            this.addModuleInitial(item);
        }
        if(start){
            let item:ModuleFunction ={
                name:name,
                func:start,
                context:context
            }
            this.addModuleStart(item);
        }
        if(run){
            let item:ModuleFunction ={
                name:name,
                func:run,
                context:context
            }
            this.addModuleRun(item);
        }
        if(stop){
            let item:ModuleFunction ={
                name:name,
                func:stop,
                context:context
            }
            this.addModuleStop(item);
        }
    }
    private addModuleInitial(func:ModuleFunction)
	{
		this.m_initialFuncsOrigin.push(func);
		this.m_initialFuncs.push(func);
    }
    private addModuleStart(func:ModuleFunction)
	{
		this.m_startFuncsOrigin.push(func);
		this.m_startFuncs.push(func);
    }
    private addModuleRun(func:ModuleFunction)
	{
		this.m_runFuncsOrigin.push(func);
		this.m_runFuncs.push(func);
    }
    private addModuleStop(func:ModuleFunction)
	{
		this.m_stopFuncsOrigin.push(func);
		this.m_stopFuncs.push(func);
    }
    private isStarted(context:any):boolean
    {
        for (const iterator of this.m_startedFuncs) {
            if (iterator.context == context){
                return true;
            }
        }
		return false;
    }
    private initial():number{
        let initialedFuncs = [];
        for (const iterator of this.m_initialFuncs) {
            let code = iterator.func.call(iterator.context);
            if (code){
                // LogInk.Ink.getInstance().log(iterator.name,"initial return",code);
                return code;
                //还原 待补充
            }
            initialedFuncs.push(iterator);
        }
        this.m_initialFuncs.length = 0;

        for (const iterator of initialedFuncs) {
            this.m_initialedFuncs.push(iterator);
        }
        return 0;
    }
    public start():number{
        this.m_moduleRunExitCode = 0;
        let initCode = this.initial();
        if (initCode != 0){
            return initCode;
        }
        let left:ModuleFunction[] = [];
        for (const iterator of this.m_startFuncs) {
            left.push(iterator);
        }
        let pending:ModuleFunction[] = [];
        for (; ; ) {
            let size = left.length;
            for (let index = 0; index < size; index++) {
                let code = left[index].func.call(left[index].context);
				if (code == -1)
				{
					pending.push(left[index]);
				}
				else if (code)
				{
					// LogInk.Ink.getInstance().log(left[index],"start return",code);
					stop();
					return code;
				}
				else
				{ //启动成功
					this.m_startedFuncs.push(left[index]);
					this.removeModuleStart(left[index].context);
				}   
            }
            if (pending.length == 0)
			{ //全部成功处理
				return 0;
			}
			else if (left.length == pending.length)
			{ //依赖性错误
				return 0;
			}
			else
			{ //继续下一轮处理
				left = pending.concat();
				pending.length = 0;
			}
        }
    }
    public run():number{
        for (;;)
		{
			let code = this.runOnce();
			if (code)
			{
				return code;
			}
		}
    }
    public runOnce():number{
        let size = this.m_runFuncs.length;
        if(size){
            RunTimeMonitor.getInstance().resetCheckStartTime();
            for (let i = 0; i < size; ++i)
            {
                let monitor = MODULE_RUNTIME(this.m_runFuncs[i].name)
                this.m_moduleRunExitCode = this.m_runFuncs[i].func.call(this.m_runFuncs[i].context);
                if(this.m_moduleRunExitCode != 0){
                    //log
                    break;
                }
                monitor.destory();
            }
            RunTimeMonitor.getInstance().check();
        }
        return 0;
    }
    public stop(){
        //收集要停止运行的函数
        let left:ModuleFunction[] = [];
        for (const it of this.m_stopFuncs) {
            if (!this.isStarted(it.context))
			{
				continue;
			}
			left.push(it);
        }
		//要等待的函数
        let pending:ModuleFunction[] = [];
		for (;;)
		{
			let size = left.length
			for (let i = 0; i < size; ++i)
			{
				let code = left[i].func.call(left[i].context);
				if (code == -1)
				{
					pending.push(left[i]);
				}
				else if (code)
				{ //运行失败也要删除,防止动态加载库的BUG
					this.removeModuleStop(left[i].context);
					this.removeModuleRun(left[i].context);
					//log
					return;
				}
				else
				{ //成功停止
					this.removeModuleStop(left[i].context);
					this.removeModuleRun(left[i].context);
				}
			}
			if (pending.length == 0)
			{ //全部成功处理
				return;
			}
			if (left.length == pending.length)
			{ //依赖性错误
				//log
				return;
			}
			else
			{ //继续下一轮处理
				left = pending.concat();
				pending.length = 0;
			}
		}
    }
    private removeModuleRun(ctx:any){
        this.removeFunc(this.m_runFuncs,ctx);
    }
    private removeModuleStop(ctx:any){
        this.removeFunc(this.m_stopFuncs,ctx);
    }
    private removeModuleStart(ctx:any){
        this.removeFunc(this.m_startFuncs,ctx);
    }
    private removeFunc(funcs:ModuleFunction[],ctx:any){
        for(var i = 0; i < funcs.length; i++){
            if(funcs[i].context == ctx){
                funcs.splice(i,1);
                break;
            }
        }
    }
}