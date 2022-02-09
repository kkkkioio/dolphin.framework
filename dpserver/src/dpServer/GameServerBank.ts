
class Ready{
    web:boolean = false;
    mongo:boolean = false;
    isReady():boolean{
        return this.web
        &&this.mongo;
    }
}

export class GameServerBank extends iService.Module<GameServerBank>{
    private m_webServerStarted:dpWeb.WebStartedEvent;
    private m_mongoConnected:iMongo.ConnectedEvent;
    private m_ready:Ready;
    private m_update:iMongo.UpdateObj;
    getModuleName(): string {
        return "GameServerBank";
    }
    start(): number{
        this.m_ready = new Ready();
        this.m_webServerStarted = new dpWeb.WebStartedEvent();
        iDolphin.EventManager.getInstance().addEventListener(this.m_webServerStarted,this.onWebStarted,this);
        this.m_mongoConnected = new iMongo.ConnectedEvent();
        iDolphin.EventManager.getInstance().addEventListener(this.m_mongoConnected,this.onMongoConnected,this);
        this.m_update = new iMongo.UpdateObj();
        return super.start();
    }
    run(): number{
        return super.run();
    }
    stop(): number{
        iDolphin.EventManager.getInstance().removeEventListener(this.m_webServerStarted,null);
        iDolphin.EventManager.getInstance().removeEventListener(this.m_mongoConnected,null)
        return super.stop();
    }
    private onWebStarted(event:dpWeb.WebStartedEvent){
        this.m_ready.web = true;
        iLog.Log.getInstance().log("web server started on ",event.host+":"+event.port);
        this.m_update.set("web",event.host + ":" + event.port);
        this.reload();
    }
    private onMongoConnected(event:iMongo.ConnectedEvent){
        this.m_ready.mongo = true;
        iLog.Log.getInstance().log("mongo db connected!");
        this.reload();
    }
    private reload(){
        if(!this.m_ready.isReady()){
            return;
        }
        this.m_update.set("time",new Date(iClock.ClockInk.getInstance().getTimeMS()));
        iMongo.MongoInk.getInstance().update(
            new iMongo.QueryHandler(()=>{}),
            "server",
            {"_id":iDolphin.Config.getInstance().get('ServerID')},
            this.m_update.getUpdate(),
            {}  
        );
        iLog.Log.getInstance().log("server started!")
    }
}