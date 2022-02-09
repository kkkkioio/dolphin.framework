import { Query, QueryHandler } from "./Query";
import { Connection } from "./Connection";
import { Result } from "./Result";

export class  QueryInsert extends Query{
    private m_obj:{};
    private m_projection:{};
    constructor(fn:QueryHandler,table:string,obj:{}){
        super(fn,table);
        this.m_obj = obj;
    }
    execute(conn:Connection,database:string){
        let ok = false;
        conn.getClient().db(database).collection(this.m_table).insertOne(this.m_obj,(err:any, result:any)=>{
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