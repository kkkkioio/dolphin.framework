import * as HTTP from 'http'
// import * as URL from 'url'
// import * as QUERY from 'querystring'

export class HttpResponse{
    private m_response:HTTP.ServerResponse;
    constructor(response:HTTP.ServerResponse){
        this.m_response = response;
        this.m_response.setHeader('Content-Type', 'text/plain;charset=utf-8');
    }
    setStatusCode(code:number){
        this.m_response.statusCode = code;
    }
    setContentType(type:string){
        this.m_response.setHeader('Content-Type', type);
    }
    addHeader(key:string, value:string){
        this.m_response.setHeader(key, value);
    }
    setResponse(data:string){
        this.m_response.end(data);
    }
}