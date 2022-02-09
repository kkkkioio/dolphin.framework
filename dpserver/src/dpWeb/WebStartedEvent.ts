export class WebStartedEvent implements iDolphin.Event{
    name: string = "WebStartedEvent";
    host:string;
    port:number;
}