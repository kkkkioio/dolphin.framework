import { JsonHandlerContext } from "./JsonHandlerContext";
import { JsonSender } from "./JsonSender";

let g_Mongo:iMongo.MongoInk = iMongo.MongoInk.getInstance();

export abstract class JsonHandler extends iService.Module<JsonHandler>{
    abstract getUrl():string;
    abstract onRequest(context:JsonHandlerContext):void;
    abstract getLoadFields(request:any):{};
    getModuleName():string{
        return this.getUrl();
    }
    start(): number{
        let url = "/";
        url += this.getUrl();
        iHttp.HttpServer.getInstance().addHandler(url,this._onRequest.bind(this));
        return super.start();
    }
    stop(): number{
        let url = "/";
        url += this.getUrl();
        iHttp.HttpServer.getInstance().removeHandler(url);
        return super.stop();
    }
    private callRequest(context:JsonHandlerContext){
        try {
            this.onRequest(context);
        } 
        catch (error) {
            let out:{} = {};
            let sender:JsonSender = new JsonSender(context.getResponse(),out);
            out["code"] = iDolphin.ERROR_CODE('SERVICE_EXCEPTION');
            out["msg"] = error.message
            sender.send();
        }
    }
    private onLoadFields(result:iMongo.Result,request:{},response:iHttp.HttpResponse){
        let out:{} = {};
        let sender:JsonSender = new JsonSender(response,out);
        if(result.error() != null){
            // let caller_line = (new Error).stack.split("\n")[4];
            out["code"] = iDolphin.ERROR_CODE("DATABASE");
            sender.send();
            return;
        }
        let obj = result.fetch();
        if(obj == null){
            out["code"] = iDolphin.ERROR_CODE('USER_KICKED');
            sender.send();
			return;
        }
        this.callRequest(new JsonHandlerContext(this.getUrl(),obj,request,response))
    }
	private _onRequest(request:iHttp.HttpRequest, response:iHttp.HttpResponse){
        let data = request.getPostData();
        // console.log(data);
        try {
            let root = JSON.parse(data);
            // console.log(root);
            let loadField = this.getLoadFields(root);
            if(Object.keys(loadField).length == 0){
                this.callRequest(new JsonHandlerContext(this.getUrl(),null,root,response))
                return;
            }
            else{
                let query = {
                    "_id":root["session"]["id"],
                    "token":root["session"]["token"],
                }
                g_Mongo.query(
                    new iMongo.QueryHandler(this.onLoadFields.bind(this),root,response),
                    "user",
                    query,
                    this.getLoadFields(root)
                );
            }
            
        } 
        catch (error) {
            throw error;
        }
    }
}