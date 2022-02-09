export class JsonHandlerContext{
    private m_user:{};
    private m_player:{};
    private m_request:{};
    private m_url:string;
    private m_response:iHttp.HttpResponse;
    constructor(url:string,user:any,request:{},response:iHttp.HttpResponse){
        this.m_url = url;
        this.m_request = request;
        this.m_response = response;
        this.m_user = user;
        if(user && user.chara){
            this.m_player = user.chara;
        }
    }
    getResponse():iHttp.HttpResponse{
        return this.m_response;
    }
    getPlayer(){
        return this.m_player;
    }
    getRequest(){
        return this.m_request;
    }
    getUser(){
        return this.m_user;
    }
}