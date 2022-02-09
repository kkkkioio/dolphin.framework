export abstract class AsyncCallBack{
    private m_result:any;
    protected getResult(){
        return this.m_result;
    }
    protected fail():boolean{
        return this.m_result["code"]["code"] != "ERROR_OK";
    }
    protected abstract execute():void;
    setResult(result:{}){
        this.m_result = result;
        this.execute();
    }
    setCode(code:{}){
        this.m_result = {
            "code":code
        }
        this.execute();
    }
}