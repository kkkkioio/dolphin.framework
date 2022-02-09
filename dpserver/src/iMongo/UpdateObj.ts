export class UpdateObj{
    private m_update:any = {};
    inc(name:string, value:number){
        this.formatInc(name,value);
    }
    set(name:string, value:any){
        this.formatUpdate("$set",name,value);
    }
    push(name:string, value:any){
        this.formatUpdate("$push",name,value);
    }
    pull(name:string, value:any){
        this.formatUpdate("$pull",name,value);
    }
    pushAll(name:string, value:any){
        this.formatUpdate("$pushAll",name,value);
    }
    addToSet(name:string, value:any){
        this.formatUpdate("$$addToSet",name,value);
    }
    unset(name:string){
        this.formatUpdate("$unset",name,"");
    }
    merge(updateObj:UpdateObj){
        let update = updateObj.getUpdate();
        for (const key in update) {
            if (key in this.m_update){
                if(key == '$inc'){
                    for (const keyCmd in update[key]) {
                        this.inc(keyCmd,update[key][keyCmd]);
                    }
                }
                else{
                    let cmdObj = this.m_update[key];
                    for (const keyCmd in update[key]) {
                        cmdObj[keyCmd] = update[key][keyCmd];
                    }
                    this.m_update[key] = cmdObj;
                }
            }
            else{
                this.m_update[key] = update[key];
            }
        }
    }
    getUpdate(){
        return this.m_update;
    }
    private formatInc(name:string, value:number){
        let key  = "$inc";
        if(key in this.m_update){
            let keyObj = this.m_update[key];
            let e = keyObj[name];
            if(!e){
                keyObj[name] = value;
            }
            else{
                // let oldValue = e;
                let newValue = e + value;
                keyObj[name] = newValue;
            }
            this.m_update[key] = keyObj;
        }
        else{
            this.m_update[key] = {};
            this.m_update[key][name] = value;
        }
    }
    private formatUpdate(key:string,name:string,value:any){
        // console.log(key,name,value)
        if(key in this.m_update){
            this.m_update[key][name] = value;
        }
        else{
            this.m_update[key] = {};
            this.m_update[key][name] = value;
        }
        // console.log(this.m_update)
    }
}