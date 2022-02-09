import * as HTTP from 'http'
import * as HTTPS from 'https'
import * as URL from 'url'
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import { ServerStartedEvent } from './ServerStartedEvent';
type RequestHandler = (request: HttpRequest,response:HttpResponse) => void;
// class HttpServerResource
// {
//     private m_request:HTTP.IncomingMessage;
//     private m_response:HTTP.ServerResponse;
//     private m_handler:RequestHandler;
//     constructor(handler:RequestHandler,request:HTTP.IncomingMessage,response:HTTP.ServerResponse){
//         this.m_handler = handler;
//         this.m_request = request;
//         this.m_response = response;
//     }
//     parse(){
//         let response = new HttpResponse(this.m_response);
//         this.m_handler(new HttpRequest(this.m_request),response)
//     }
// }
let g_Log:iLog.Log = iDolphin.getInstance(iLog.Log);

export class HttpServer extends iService.Module<HttpServer>{
    private m_server:HTTP.Server|HTTPS.Server;
    private m_listenIP:string;
    private m_listenPort:number;
    private m_sslPemFile:string;
    private m_resources:any = {};
    getModuleName(): string {
        return "HttpServer";
    }
    addHandler(url:string,handler:RequestHandler){
        if(url in this.m_resources){
            return;
        }
        this.m_resources[url] = handler;
    }
    removeHandler(url:string){
        if(url in this.m_resources){
            delete this.m_resources[url];
        }
    }
    config(listenIP:string = "0.0.0.0",listenPort:number = 80,callBack:Function = null,sslPemFile:string = null)
    {
        this.m_listenIP = listenIP;
        this.m_listenPort = listenPort;
        let that = this;
        if(sslPemFile){
            this.m_sslPemFile = sslPemFile;
        }
        else{
            this.m_server = HTTP.createServer((req,rep)=>{
                let url = URL.parse(req.url).pathname;
                // console.log(url,req.method)
                let httpRep = new HttpRequest(req);
                if(req.method === 'GET') {
                    if(url in that.m_resources){
                        that.m_resources[url](httpRep,new HttpResponse(rep));
                    }
                    else{
                        iLog.Log.getInstance().log("url not found",url);
                    }
                }else if(req.method === 'POST') {
                    httpRep.onPost(()=>{
                        if(url in that.m_resources){
                            that.m_resources[url](httpRep,new HttpResponse(rep));
                        }
                        else{
                            iLog.Log.getInstance().log("url not found",url);
                        }
                    });
                }
            });
            this.m_server.listen(listenPort,this.m_listenIP, function () {
                let addressInfo:any = that.m_server.address();
                let event:ServerStartedEvent = new ServerStartedEvent();
                event.host = addressInfo.address;
                event.port = addressInfo.port;
                iDolphin.EventManager.getInstance().raiseEvent(event);
                if(callBack){
                    callBack();
                }
            });
        }
    }
}