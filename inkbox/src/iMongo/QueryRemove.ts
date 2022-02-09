import { Query, QueryHandler } from "./Query";
import { Connection } from "./Connection";
import { Result } from "./Result";

export class  QueryRemove extends Query{
    private m_query:{};
    constructor(fn:QueryHandler,table:string,query:{}){
        super(fn,table);
        this.m_query = query;
    }
    execute(conn:Connection,database:string){
        let ok = false;
        conn.getClient().db(database).collection(this.m_table).deleteOne(this.m_query,(err:any, result:any)=>{
            let r = new Result();
            if (err){
                // err.message;
                r.setError(err.message,0);
            }
            else{
                ok = true;
                r.setError(null,0);
            }
            this.setResult(r);
        })
        return ok;
    }
}