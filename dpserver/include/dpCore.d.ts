declare module dpCore {
    declare abstract class AsyncCallBack {
        private m_result;
        protected getResult(): any;
        protected fail(): boolean;
        protected abstract execute(): void;
        setResult(result: {}): void;
        setCode(code: {}): void;
    }
}