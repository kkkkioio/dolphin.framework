export class Result{
    private m_count:number;
    private m_error:any;
    private m_rows:any[];
    setError(error:any,count:number){
        this.m_error = error;
        this.m_count = count;
    }
    setRows(rows:any[]){
        this.m_rows = rows.concat();
        this.m_count = this.m_rows.length;
    }
    error(){
        return this.m_error;
    }
    count():number{
        return this.m_count;
    }
    fetch():any{
        if(!this.m_rows){
            return null;
        }
        if(this.m_rows.length == 0){
            return null;
        }
        return this.m_rows.pop();
    }
}