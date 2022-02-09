declare module iMongo {
    declare class Result {
        private m_count;
        private m_error;
        private m_rows;
        setError(error: any, count: number): void;
        setRows(rows: any[]): void;
        error(): any;
        count(): number;
        fetch(): any;
    }
    declare type QueryFunction = (result: Result, ...arg: any[]) => void;
    declare class QueryHandler {
        private m_fn;
        private m_args;
        constructor(fn: QueryFunction, ...arg: any[]);
        call(result: Result): void;
    }
    declare class MongoInk extends inkbox.Ink {
        inkName: string;
        private m_con;
        private m_db;
        private static s_instance;
        static getInstance(): MongoInk;
        start(): number;
        query(fn: QueryHandler, table: string, query: {}, projection: {}): void;
        insert(fn: QueryHandler, table: string, obj: {}): void;
        remove(fn: QueryHandler, table: string, query: {}): void;
        update(fn: QueryHandler, table: string, query: {}, update: {},option:{}): void;
    }
    declare class UpdateObj {
        private m_update;
        inc(name: string, value: number): void;
        set(name: string, value: any): void;
        push(name: string, value: any): void;
        pull(name: string, value: any): void;
        pushAll(name: string, value: any): void;
        addToSet(name: string, value: any): void;
        unset(name: string): void;
        merge(updateObj: UpdateObj): void;
        getUpdate(): any;
        private formatInc;
        private formatUpdate;
    }
    declare class ConnectedEvent implements iDolphin.Event {
        name: string;
    }
}