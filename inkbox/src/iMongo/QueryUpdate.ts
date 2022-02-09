import { Query, QueryHandler } from "./Query";
import { Connection } from "./Connection";
import { Result } from "./Result";

export class  QueryUpdate extends Query{
    private m_query:{};
    private m_update:any;
    private m_option:any;
    constructor(fn:QueryHandler,table:string,query:{},update:{},option:any){
        super(fn,table);
        this.m_query = query;
        this.m_update = update;
        this.m_option = option;
        // if(option == 1){
        //     this.m_option.upsert = true;
        // }
        // console.log(this.m_update)
    }
    execute(conn:Connection,database:string){
        let ok = false;
        // console.log(this.m_query)
        // console.log(this.m_update)
        conn.getClient().db(database).collection(this.m_table).updateOne(this.m_query,this.m_update,this.m_option,(err:any, result:any)=>{
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