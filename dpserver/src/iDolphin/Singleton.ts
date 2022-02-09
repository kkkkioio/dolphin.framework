
//单例模式抽象，分离创建对象的函数和判断对象是否已经创建
export function getInstance<T>(fn:new () => T):T {
    if(!(<any>fn).instance){
        (<any>fn).instance = new fn();
    }
    return (<any>fn).instance;
};
//继承方式单例
export class Singleton {
    static getInstance<T extends {}>(this: new () => T): T {
        if(!(<any>this).instance){
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }
    static clear<T extends {}>(this: new() => T): void {
        delete (<any>this).instance;
    }
}
// let a = 0;
// class A{
//     a:number;
//     constructor(){
//         this.a = a+1;
//     }
//     print(){
//         console.log(this.a)
//     };
// }
// getInstance(A).print()
// getInstance(A).print()