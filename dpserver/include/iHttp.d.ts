declare module iHttp {
    declare class HttpRequest {
        private m_request;
        constructor(request: HTTP.IncomingMessage);
        getMethod(): string;
        getQueryString(): string;
        getPostData(): string;
    }
    declare class HttpResponse {
        private m_response;
        constructor(response: HTTP.ServerResponse);
        setStatusCode(code: number): void;
        setContentType(type: string): void;
        addHeader(key: string, value: string): void;
        setResponse(data: string): void;
    }
    declare type RequestHandler = (request: HttpRequest, response: HttpResponse) => void;
    declare class HttpServer extends iService.Module<HttpServer> {
        private m_server;
        private m_listenIP;
        private m_listenPort;
        private m_sslPemFile;
        private m_resources;
        getModuleName(): string;
        addHandler(url: string, handler: RequestHandler): void;
        removeHandler(url: string): void;
        config(listenIP?: string, listenPort?: number, callBack?: Function, sslPemFile?: string): void;
    }
    declare class ServerStartedEvent implements iDolphin.Event {
        name: string;
        host: string;
        port: number;
    }
}