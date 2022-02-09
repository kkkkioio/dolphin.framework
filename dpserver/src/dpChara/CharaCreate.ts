/**
 * session
 * nickname
 */
class CharacterCreateCallBack extends dpCore.AsyncCallBack{
    private m_context:dpWeb.JsonHandlerContext;
    constructor(ctx:dpWeb.JsonHandlerContext){
        super();
        this.m_context = ctx;
    }
    protected execute(): void {
        let out = this.getResult();
        let sender = new dpWeb.JsonSender(this.m_context.getResponse(),out);
        if(this.fail()){
            sender.send();
            return;
        }
        //处理登录成功事件
        sender.send();
    }
}
export class CharaCreate extends dpWeb.JsonHandler{
    getUrl(): string {
        return "dp.chara.create";
    }
    onRequest(context: dpWeb.JsonHandlerContext): void {
        let out = {};
        let sender = new dpWeb.JsonSender(context.getResponse(),out);
        if(context.getPlayer()){
            out["code"] = iDolphin.ERROR_CODE("ERROR_CHARACTER_EXISTED");
            sender.send();
            return;
        }
        let request = context.getRequest();
        let nickname = request["nickname"];
        this.createCharacter(
            request["session"]["id"],
            nickname,
            {},
            new CharacterCreateCallBack(context)
        )
    }
    createCharacter(userID:number,nickname:string,player:any,cb:CharacterCreateCallBack){
        let update:iMongo.UpdateObj = new iMongo.UpdateObj();
        player["nickname"] = nickname;
        player["createTime"] = new Date(iClock.ClockInk.getInstance().getTimeMS());
        update.set("chara",player);
        iMongo.MongoInk.getInstance().update(
            new iMongo.QueryHandler(this.onCreateCharacter.bind(this),player,cb),
            "user",
            {"_id":userID},
            update.getUpdate(),
            {}
        );
    }
    private onCreateCharacter(result:iMongo.Result,player:any,cb:CharacterCreateCallBack){
        if(result.error() != null){
            cb.setCode(iDolphin.ERROR_CODE('ERROR_DATABASE'));
			return;
        }
        // if(result.count() == 0){
        //     cb.setCode(iDolphin.ERROR_CODE('ERROR_CHARACTER_EXISTED'));
		// 	return;
        // }
        let out = {};
        out["code"] = iDolphin.ERROR_CODE('ERROR_OK');
		out["chara"] = player;
		cb.setResult(out);
    }
    getLoadFields(request: any): {} {
        return {
            "account" : 1
        }
    }
}