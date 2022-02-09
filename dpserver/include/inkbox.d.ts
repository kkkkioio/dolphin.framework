declare module inkbox {
    class Ink {
        start(): number;
        run(): void;
        stop(): number;
        shouldCallRun(): boolean;
    }
    declare class Box {
        inkPath: string;
        private m_inks;
        static s_instance: Box;
        static getInstance(): Box;
        loadInk(name: string): void;
        boxRun(): boolean;
    }
}