import { Query, QueryHandler } from "./Query";
import { Connection } from "./Connection";
import { Result } from "./Result";

export class  QueryQuery extends Query{
    private m_query:{};
    private m_projection:{};
    constructor(fn:QueryHandler,table:string,query:{},projection:{}){
        super(fn,table);
        this.m_query = query;
        this.m_projection = projection;
    }
    execute(conn:Connection,database:string){
        let ok = false;
        conn.getClient().db(database).collection(this.m_table).find(this.m_query,this.m_projection).toArray((err:any, result:any)=>{
            let r = new Result();
            if (err){
                // err.message;
                r.setError(err.message,0);
            }
            else{
                ok = true;
                r.setRows(result);
            }
            this.setResult(r);
        })
        return ok;
    }
}