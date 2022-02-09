declare module dpWeb {
	declare class JsonSender {
        private m_response;
        private m_value;
        constructor(response: iHttp.HttpResponse, value: {});
        send(): void;
    }
    declare abstract class JsonHandler extends iService.Module<JsonHandler> {
        abstract getUrl(): string;
        abstract onRequest(context: JsonHandlerContext): void;
        abstract getLoadFields(request: any): {};
        getModuleName(): string;
        start(): number;
        stop(): number;
        private callRequest;
        private onLoadFields;
        private _onRequest;
    }
    declare class JsonHandlerContext {
        private m_user;
        private m_player;
        private m_request;
        private m_url;
        private m_response;
        constructor(url: string, user: {}, request: {}, response: iHttp.HttpResponse);
        getResponse(): iHttp.HttpResponse;
        getPlayer(): {};
        getRequest(): {};
        getUser(): {};
    }
    declare class WebStartedEvent implements iDolphin.Event {
        name: string;
        host: string;
        port: number;
    }
}