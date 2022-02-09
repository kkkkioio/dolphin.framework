
const http = require('http');
const host = '192.168.1.14';
const port = 666;
const account = "th001"
const nickname = "dolphin"
function sendReq(url,param,callback){
    let params = JSON.stringify(param)
    let options = {
        host: host,
        port: port,
        path: url,
        method: 'post',
        headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':params.length
        }};
    
    let req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var _data="";
        res.on('data', function (chunk) {
            _data+=chunk;
        });
        res.on('end', function(){
            console.log("REBOAK:",_data)
            callback(JSON.parse(_data))
        });
    });
    
    req.write(params);
    req.end();
}
//测试用例
/**
 * 账号登录
 */
sendReq("/dp.login",{
    "account":account
},result =>{
    /**
     * 如果角色不存在则创建角色,否则登录成功
     */
    // console.log(result);
    if(result.code.code != "ERROR_OK"){
        console.log("登录失败");
        return;
    }
    if(result.chara){
        console.log("登录成功");
        return;
    }
    console.log("创建角色");
    let session = result.session;
    sendReq("/dp.chara.create",{
        session:session,
        nickname:nickname
    },r =>{
        if(result.code.code != "ERROR_OK"){
            console.log("创建角色失败");
            return;
        }
        console.log("创建角色成功");
        console.log("登录成功");
    })
})