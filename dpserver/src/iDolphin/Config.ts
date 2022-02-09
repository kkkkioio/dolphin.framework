import { Singleton } from "./Singleton";
const fs = require("fs");
export class Config extends Singleton{
    private m_config:any;
    load(){
        let config = fs.readFileSync("../conf/config.json").toString('utf-8');
        this.m_config = JSON.parse(config);
    }
    get(name:string){
        return this.m_config[name];
    }
}