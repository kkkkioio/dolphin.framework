export class JsonSender{
    private m_response:iHttp.HttpResponse;
    private m_value:{};
    constructor(response:iHttp.HttpResponse,value:{}){
        this.m_response = response;
        this.m_value = value;
    }
    send(){
        this.m_response.setResponse(JSON.stringify(this.m_value));
    }
}