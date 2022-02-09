import { JsonSender } from "src/dpWeb/JsonSender";

/**
 * account
 */
let s_min = 100000;
let s_max = 999999;

function randomString(len:number) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
}

class CreateCallBack extends dpCore.AsyncCallBack{
    private m_req:{};
    private m_rep:iHttp.HttpResponse;
    private m_obj:any;
    constructor(req:{},rep:iHttp.HttpResponse,obj:any){
        super()
        this.m_rep = rep;
        this.m_req = req;
        this.m_obj = obj;
    }
    protected execute(){
        let result = this.getResult();
        let sender = new dpWeb.JsonSender(this.m_rep,result);CreateCallBack
        if(this.fail()){
            sender.send();
            return;
        }
        let userID = result["userID"];
		let token = result["token"];
        this.m_obj.updateAccount(this.m_req,userID,token,this.m_rep);
    }
}

class LoginDeviceLoginTokenCallBack extends dpCore.AsyncCallBack{
    private m_userID:number;
    private m_response:iHttp.HttpResponse;
    private m_obj:any;
    constructor(userID:number,response:iHttp.HttpResponse,obj:any){
        super()
        this.m_userID = userID;
        this.m_response = response;
        this.m_obj = obj;
    }
    protected execute(): void {
        let out = this.getResult();
        let sender = new JsonSender(this.m_response,out);
        if(this.fail())
		{
            sender.send();
			return;
		}
        this.m_obj.loadUser(this.m_userID,out["token"],new LoadUserCallBack(this.m_response));
    }
}

class LoadUserCallBack extends dpCore.AsyncCallBack{
    private m_rep:iHttp.HttpResponse;
    private m_user:any;
    constructor(response:iHttp.HttpResponse){
        super()
        this.m_rep = response;
    }
    setUser(user:any){
        this.m_user = user;
    }
    protected execute(): void {
        let out = this.getResult();
        let sender = new dpWeb.JsonSender(this.m_rep,out);
        if(this.fail()){
            sender.send();
            return;
        }
        if('chara' in this.m_user){
            out["chara"] = this.m_user['chara'];
        }
        out["session"] = {
            "id":this.m_user['_id'],
            "token":this.m_user['token'],
        }
        sender.send();
    }
}

export class Login extends dpWeb.JsonHandler{
    getUrl(): string {
        return "dp.login";
    }
    onRequest(context: dpWeb.JsonHandlerContext): void {
        let request = context.getRequest();
        iMongo.MongoInk.getInstance().query(
            new iMongo.QueryHandler(this.onQuery.bind(this),request,context.getResponse()),
            "account",
            {"_id" : request["account"]},
            {}
        );
    }
    onQuery(result:iMongo.Result,request:{},response:iHttp.HttpResponse){
        let out = {};
        let sender = new dpWeb.JsonSender(response,out);
        if(result.error() != null){
            out["code"] = iDolphin.ERROR_CODE('ERROR_DATABASE');
            sender.send();
			return;
        }
        let obj = result.fetch();
        if(obj != null && obj.userID != null){
            //登录
            this.setUserToken(obj.userID,new LoginDeviceLoginTokenCallBack(obj.userID,response,this));
        }
        else{
            //创建
            this.createUser(request["account"],new CreateCallBack(request,response,this));
        }
    }
    setUserToken(userID:number,cb:LoginDeviceLoginTokenCallBack){
        let token = randomString(16);
        let update:iMongo.UpdateObj = new iMongo.UpdateObj();
        update.set("token" , token);
		update.set("time" , new Date());
        iMongo.MongoInk.getInstance().update(
            new iMongo.QueryHandler(this.onSetUserToken.bind(this),token,cb),
            "user",
            {"_id":userID},
            update.getUpdate(),
            {}
        );
    }
    onSetUserToken(result:iMongo.Result,token:string,cb:LoginDeviceLoginTokenCallBack){
        if(result.error() != null){
            cb.setCode(iDolphin.ERROR_CODE('ERROR_DATABASE'));
			return;
        }
        let out = {
            "code":iDolphin.ERROR_CODE('ERROR_OK'),
            "token":token
        };
        cb.setResult(out);
    }
    updateAccount(request:{},userID:number,token:string,response:iHttp.HttpResponse){
        // console.log("#########################################")
        let update:iMongo.UpdateObj = new iMongo.UpdateObj();
        update.set("userID",userID);
        // console.log(update)
        iMongo.MongoInk.getInstance().update(
            new iMongo.QueryHandler(this.onUpdateAccount.bind(this),userID,token,response),
            "account",
            {"_id":request["account"]},
            update.getUpdate(),
            {"upsert":true}  
        );
    }
    onUpdateAccount(result:iMongo.Result,userID:number,token:string,response:iHttp.HttpResponse){
        let out = {};
        let sender = new dpWeb.JsonSender(response,out);
        if(result.error() != null){
            out["code"] = iDolphin.ERROR_CODE('ERROR_DATABASE');
            sender.send();
			return;
        }
        this.loadUser(userID,token,new LoadUserCallBack(response));
    }
    loadUser(userID:number,token:string,cb:LoadUserCallBack,reload:boolean = false){
        iMongo.MongoInk.getInstance().query(
            new iMongo.QueryHandler(this.onLoadUser.bind(this),userID,token,cb,reload),
            "user",
            {"_id" : userID , "token" : token},
            {}
        );
    }
    onLoadUser(result:iMongo.Result,userID:number,token:string,cb:LoadUserCallBack,reload:boolean){
        if(result.error() != null){
            cb.setCode(iDolphin.ERROR_CODE('ERROR_DATABASE'));
			return;
        }
        let obj = result.fetch();
        if(obj == null){
            cb.setCode(iDolphin.ERROR_CODE('ERROR_CHARA'));
			return;
        }
        cb.setUser(obj);
        cb.setCode(iDolphin.ERROR_CODE('ERROR_OK'));
        // if(obj.chara){
        //     delete obj.chara;
        //     cb.setUser(obj);
        // }
        // else{
        //     if(reload){
        //         cb.setUser(obj);
        //     }
        //     else{

        //     }
        // }
    }
    onCreateUser(result:iMongo.Result,userID:number,account:string,token:string,fn:CreateCallBack){
        // console.log(userID)
        let error:string = result.error();     
        if(error && error.startsWith("E11000 duplicate key")){
            this.createUser(account,fn);
            return;
        }
        if(error){
            fn.setCode(iDolphin.ERROR_CODE("ERROR_DATABASE"));
            return;
        }
        let out = {};
        out["code"] = iDolphin.ERROR_CODE('ERROR_OK');
		out["userID"] = userID;
        out["token"] = token;
        fn.setResult(out);
    }
    createUser(account:string,fn:CreateCallBack){
        let range = s_max - s_min;
        let userID = Math.floor(Math.random()*range) + s_min;
        let token = randomString(16);
        let userObj = {
            "_id":userID,
            "token":token,
            "account":account,
            "time":new Date()
        }
        iMongo.MongoInk.getInstance().insert(
            new iMongo.QueryHandler(this.onCreateUser.bind(this),userID,account,token,fn),
            "user",
            userObj
        );
    }
    getLoadFields(request: any): any {
        return {};
    }
}