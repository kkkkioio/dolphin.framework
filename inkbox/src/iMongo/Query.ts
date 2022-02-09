import { Result } from "./Result";
export type QueryFunction = (result: Result,...arg:any[]) => void;
export class QueryHandler{
    private m_fn:QueryFunction;
    private m_args:any[];
    constructor(fn:QueryFunction,...arg:any[]){
        this.m_fn = fn;
        this.m_args = arg;
    }
    call(result: Result){
        this.m_fn(result,...this.m_args)
    }
}
export class Query{
    protected m_callback:QueryHandler;
    protected m_table:string;
    constructor(fn:QueryHandler,table:string){
        this.m_callback = fn;
        this.m_table = table;
    }
    setResult(r:Result){
        this.m_callback.call(r)
    }
}