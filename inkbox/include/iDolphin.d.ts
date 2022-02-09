declare module iDolphin {
	declare function getInstance<T>(fn: new () => T): T;
    declare class Singleton {
        static getInstance<T extends {}>(this: new () => T): T;
        static clear<T extends {}>(this: new () => T): void;
    }
    declare class Config extends Singleton {
        private m_config;
        load(): void;
        get(name: string): any;
    }
    declare function ERROR_CODE(code: string): {
        file: string;
        code: string;
    }
    interface Event {
        name: string;
    }
    declare type EventManagerCallFunc = (event: Event) => void;
    declare class EventManager extends Singleton {
        private m_eventListeners;
        private getEventListenersIndex;
        addEventListener(event: Event, callBack: EventManagerCallFunc, target?: any): boolean;
        setEventListener(event: Event, callBack: EventManagerCallFunc, target?: any): boolean;
        removeEventListener(event: Event, callBack: EventManagerCallFunc, target?: any): void;
        raiseEvent(event: Event): void;
    }
}