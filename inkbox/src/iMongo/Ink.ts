import { QueryHandler } from "./Query";
import { Connection } from "./Connection";
import { ConnectionParam } from "./ConnectionParam";
import { QueryQuery } from "./QueryQuery";
import { QueryInsert } from "./QueryInsert";
import { QueryRemove } from "./QueryRemove";
import { QueryUpdate } from "./QueryUpdate";
import { UpdateObj } from "./UpdateObj";
import { ConnectedEvent } from "./ConnectedEvent";
//后续分离用
let s_depends = [
   "iDolphin",
   "iLog"
]
for (const depend of s_depends) {
   inkbox.Box.getInstance().loadInk(depend);
}

export class MongoInk extends inkbox.Ink{
    inkName:string = "MongoInk";
    private m_con:Connection;
    private m_db:string;
    private static s_instance:MongoInk;
    static getInstance():MongoInk{
        return MongoInk.s_instance
    }
    start():number {
        let conf = iDolphin.Config.getInstance();
        let param:ConnectionParam = {
            database:conf.get("DbName"),
            account:conf.get("DbUser"),
            password:conf.get("DbPass"),
            host:conf.get("DbHost")
        };
        this.m_db = param.database;
        this.m_con = new Connection();
        this.m_con.config(param);
        this.m_con.start();
        MongoInk.s_instance = this;
        return 0;
     }
     query(fn:QueryHandler,table:string,query:{},projection:{}){
        new QueryQuery(fn,table,query,projection).execute(this.m_con,this.m_db);
     }
     insert(fn:QueryHandler,table:string,obj:{}){
        new QueryInsert(fn,table,obj).execute(this.m_con,this.m_db);
     }
     remove(fn:QueryHandler,table:string,query:{}){
        new QueryRemove(fn,table,query).execute(this.m_con,this.m_db);
     }
     update(fn:QueryHandler,table:string,query:{},update:{},option:any){
        new QueryUpdate(fn,table,query,update,option).execute(this.m_con,this.m_db);
     }
}
//注册导出模块
export class Ink{

} 
Ink["ctor"] = MongoInk;
Ink["MongoInk"] = MongoInk;
Ink["QueryHandler"] = QueryHandler;
Ink["UpdateObj"] = UpdateObj;
Ink["ConnectedEvent"] = ConnectedEvent;

