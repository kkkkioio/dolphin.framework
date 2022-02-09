declare module iService{
    declare class RunTimeMonitor extends iDolphin.Singleton {
        private m_allModuleCheckTime;
        private m_oneModuleCheckTime;
        private m_checkStartTime;
        private m_parseMessageCheckTime;
        private m_funcCheckTime;
        private m_moduleInfos;
        constructor();
        setOneModuleCheckTime(checkTime: number): void;
        setAllModuleCheckTime(checkTime: number): void;
        setParseMessageCheckTime(checkTime: number): void;
        getModuleName(): string;
        getCheckStartTime(): number;
        resetCheckStartTime(): void;
        check(): void;
        insertModuleInfo(info: ModuleInfo): ModuleInfo;
        logOneModuleInfo(info: ModuleInfo): void;
        logAllModuleInfo(allCost: number): void;
    }
    declare class Service extends iDolphin.Singleton {
        private m_initialFuncsOrigin;
        private m_startFuncsOrigin;
        private m_runFuncsOrigin;
        private m_stopFuncsOrigin;
        private m_initialFuncs;
        private m_startFuncs;
        private m_runFuncs;
        private m_stopFuncs;
        private m_initialedFuncs;
        private m_startedFuncs;
        private m_moduleRunExitCode;
        /**
         *
         * @param context
         * @param initial
         * @param start
         * @param run
         * @param stop
         * @param name
         */
        registModule(context: any, //!< 模块对象指针
        initial: Function, //!< 开始函数
        start: Function, //!< 开始函数
        run: Function, //!< 运行函数
        stop: Function, //!< 停止函数
        name: string): void;
        private addModuleInitial;
        private addModuleStart;
        private addModuleRun;
        private addModuleStop;
        private isStarted;
        private initial;
        start(): number;
        run(): number;
        runOnce(): number;
        stop(): void;
        private removeModuleRun;
        private removeModuleStop;
        private removeModuleStart;
        private removeFunc;
    }
    declare abstract class Module<T> extends iDolphin.Singleton {
        private m_started;
        private m_refs;
        isStarted(): boolean;
        addRef(): void;
        releaseRef(): void;
        abstract getModuleName(): string;
        checkStart(): boolean;
        checkStop(): boolean;
        constructor();
        initial(): number;
        start(): number;
        run(): number;
        stop(): number;
    }
}