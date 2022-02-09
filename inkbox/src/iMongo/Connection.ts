import { ConnectedEvent } from "./ConnectedEvent";
import { ConnectionParam } from "./ConnectionParam";
const MongoClient = require('mongodb').MongoClient;
export class Connection{
    private m_ready:boolean;
    private m_param:ConnectionParam;
    private m_client:any;
    config(param:ConnectionParam){
        this.m_param = param;
        this.m_ready = false;
    }
    start():number{
        let url = 'mongodb://'
        + this.m_param.account
        + ':'
        + this.m_param.password 
        + '@'
        + this.m_param.host 
        + '/admin';
        let that = this;
        MongoClient.connect(url, function(err:any, client:any) {
            if (err){
                iLog.Log.getInstance().log("DB connect failed", err.message);
                return;
            }
            // iLog.Log.getInstance().log("DB connect sucess!");
            // let db = client.db("th").listCollections().toArray().then(
            //     function (tables) {
            //       tables.forEach(function (value, index, ts) {
            //       console.log(value.name);
            //       })
            //   })
            //  console.log(db)
            that.m_client = client;
            // that.m_db = client.db(that.m_param.database)
            that.onConnectd();
            // client.close();
        });
        return 0;
    }
    onConnectd(){
        this.m_ready = true;
        let event:ConnectedEvent = new ConnectedEvent();
        iDolphin.EventManager.getInstance().raiseEvent(event);
    }
    getClient():any{
        // console.log(this)
        return this.m_client;
    }
}