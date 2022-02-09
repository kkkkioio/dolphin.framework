let g_Log:iLog.Log = iLog.Log.getInstance();

interface MessageInfo{
    msgID:number;
    runTime:number;
}

interface ModuleInfo{
    name:string;
    runTime:number;
    msgInfos:MessageInfo[];
}

function getRunMilliseconds()
{
    return new Date().getTime();
}
let g_curModuleInfo:ModuleInfo;
let g_curMessageInfo:MessageInfo;
export class RunTimeMonitor extends iDolphin.Singleton{
    private m_allModuleCheckTime:number;
    private m_oneModuleCheckTime:number;
    private m_checkStartTime:number;
    private m_parseMessageCheckTime:number;
    private m_funcCheckTime:number;
    private m_moduleInfos:ModuleInfo[] = [];
    constructor() {
        super();
        this.m_oneModuleCheckTime = 5;
		this.m_allModuleCheckTime = 10;
        this.m_parseMessageCheckTime = 10;

        // this.m_oneModuleCheckTime = 0;
		// this.m_allModuleCheckTime = 0;
        // this.m_parseMessageCheckTime = 0;

		this.m_checkStartTime = getRunMilliseconds();
    }
    setOneModuleCheckTime(checkTime:number){
        this.m_oneModuleCheckTime = checkTime;
    }
    setAllModuleCheckTime(checkTime:number){
        this.m_allModuleCheckTime = checkTime;
    }
    setParseMessageCheckTime(checkTime:number){
        this.m_parseMessageCheckTime = checkTime;
    }
    getModuleName(): string {
        return "RunTimeMonitor";
    }
    getCheckStartTime():number{
        return this.m_checkStartTime;
    }
    resetCheckStartTime(){
        this.m_checkStartTime = getRunMilliseconds();
    }
    check(){
        let checkAllModuleTime:number = 0;
        for (const iterator of this.m_moduleInfos) {
            checkAllModuleTime += iterator.runTime;
            if (iterator.runTime >= this.m_oneModuleCheckTime){
				this.logOneModuleInfo(iterator);
			}
        }
        if (checkAllModuleTime >= this.m_allModuleCheckTime){
			this.logAllModuleInfo(checkAllModuleTime);
        }
        this.m_moduleInfos.length = 0;
    }
    insertModuleInfo(info:ModuleInfo):ModuleInfo{
        this.m_moduleInfos.push(info);
        return info;
    }
    logOneModuleInfo(info:ModuleInfo){
        iDolphin.getInstance(iLog.Log).log("----------------------------------",info.name,"use time",info.runTime,"ms----------------------------------");
        for (let i = 0; i < info.msgInfos.length; ++i) {
            g_Log.log(info.msgInfos[i].msgID,"use time",info.msgInfos[i].runTime);
        }
    }
    logAllModuleInfo(allCost:number){
        g_Log.log("**************************************************************************************************************");
        g_Log.log("*   all cost:",allCost," ms   *");
        g_Log.log("**************************************************************************************************************");
        for (const iterator of this.m_moduleInfos) {
            this.logOneModuleInfo(iterator);
        }
    }
}

class ModuleRunTimeMonitorHelper{
    private m_checkTime:number;
    constructor(name:string){
        this.m_checkTime = RunTimeMonitor.getInstance().getCheckStartTime();
        let newInfo:ModuleInfo = {
            name:name,
            runTime:0,
            msgInfos:[]
        }
        g_curModuleInfo = RunTimeMonitor.getInstance().insertModuleInfo(newInfo);
    }
    destory(){
        if (!g_curModuleInfo){
            return;
        }
        RunTimeMonitor.getInstance().resetCheckStartTime();
		g_curModuleInfo.runTime = RunTimeMonitor.getInstance().getCheckStartTime() - this.m_checkTime;
		g_curModuleInfo = null;
    }
}

export function MODULE_RUNTIME(name:string) {
    return new ModuleRunTimeMonitorHelper(name);
}