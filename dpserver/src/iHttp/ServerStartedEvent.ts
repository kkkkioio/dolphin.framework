export class ServerStartedEvent implements iDolphin.Event{
    name: string = "ServerStartedEvent";
    host:string;
    port:number;
}