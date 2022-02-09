import * as HTTP from 'http'
import * as URL from 'url'
// import * as QUERY from 'querystring'

export class HttpRequest{
    private m_request:HTTP.IncomingMessage;
    private m_data:string;
    constructor(request:HTTP.IncomingMessage){
        this.m_request = request;
    }
    getMethod():string{
        return this.m_request.method!;
    }
    getQueryString():string{
        URL.parse(this.m_request.url!).pathname
        return URL.parse(this.m_request.url!).query!;
    }
    onPost(cb:Function){
        // 定义了一个data变量，用于暂存请求体的信息
        let data = '';
        // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        this.m_request.on('data', function(chunk){    
            data += chunk;
        }); 
        let that = this;
        // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        this.m_request.on('end', function(){    
            that.m_data = data;
            cb();
        });
    }
    getPostData():string{
        return this.m_data;
    }
}