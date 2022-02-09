import { Singleton } from "./Singleton";

/*
*   事件管理器，事件的监听、触发、移除
*/
export interface Event{
    name:string;
}
export type EventManagerCallFunc = (event: Event) => void;

interface CallBackTarget {
    callBack: EventManagerCallFunc,
    target: any,
}

export class EventManager extends Singleton {
    private m_eventListeners: { [key: string]: CallBackTarget[] } = {};
    private getEventListenersIndex(event: Event, callBack: EventManagerCallFunc, target?: any): number {
        let index = -1;
        let eventName = event.name;
        for (let i = 0; i < this.m_eventListeners[eventName].length; i++) {
            let iterator = this.m_eventListeners[eventName][i];
            if (iterator.callBack == callBack && (!target || iterator.target == target)) {
                index = i;
                break;
            }
        }
        return index;
    }

    addEventListener(event: Event, callBack: EventManagerCallFunc, target?: any): boolean {
        if (!event) {
            return;
        }
        let eventName = event.name;
        if (null == callBack) {
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        if (null == this.m_eventListeners[eventName]) {
            this.m_eventListeners[eventName] = [callTarget];

        } else {
            let index = this.getEventListenersIndex(event, callBack, target);
            if (-1 == index) {
                this.m_eventListeners[eventName].push(callTarget);
            }
        }
        return true;
    }

    setEventListener(event: Event, callBack: EventManagerCallFunc, target?: any): boolean {
        if (!event) {
            return;
        }
        let eventName = event.name;
        if (null == callBack) {
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        this.m_eventListeners[eventName] = [callTarget];
        return true;
    }

    removeEventListener(event: Event, callBack: EventManagerCallFunc, target?: any) {
        let eventName = event.name;
        if (null != this.m_eventListeners[eventName]) {
            let index = this.getEventListenersIndex(event, callBack, target);
            if (-1 != index) {
                this.m_eventListeners[eventName].splice(index, 1);
            }
        }
    }

    raiseEvent(event: Event) {
        let eventName = event.name;
        if (null != this.m_eventListeners[eventName]) {
            let callbackList: CallBackTarget[] = [];
            for (const iterator of this.m_eventListeners[eventName]) {
                callbackList.push({ callBack: iterator.callBack, target: iterator.target });
            }
            for (const iterator of callbackList) {
                iterator.callBack.call(iterator.target, event);
            }
        }
    }
}

/**
 * 抛事件
 * let progress:LoadingProgress extends Event = {
        index:index,
        max:self.m_totalCount,
        finish:finish,
        total:total,
        url:item.url
        name:'loading'
    }
    G_EventMgr.raiseEvent(progress);
    接受事件
    class Exp
    {
        onLoad () {
            G_EventMgr.addEventListener(progress,this.onProgress,this)
        }
        onDestroy(){
            G_EventMgr.removeEventListener(progress,this.onProgress,this)
        }
        onProgress(name:string,progress:LoadingProgress){

        }
    }
 */