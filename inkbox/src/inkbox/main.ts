import { Box } from "./Box";
import { Ink } from "./Ink";
Object.defineProperty(globalThis, "inkbox", { value: {
    "Ink":Ink,
    "Box":Box
} });  
let _box = Box.getInstance();
const fs = require("fs");
let config = fs.readFileSync("../conf/inkbox.json").toString('utf-8');
const jsonConfig = JSON.parse(config);
for (const iterator of jsonConfig) {
    // let mdl = require(inkPath + iterator);
    // Object.defineProperty(globalThis, iterator, { value: mdl.Ink });   
    _box.loadInk(iterator);
}

// function main() {
//     process.nextTick(main);
//     _box.boxRun();
// }

// main();
// for (;_box.boxRun();){}
setInterval(()=>_box.boxRun());