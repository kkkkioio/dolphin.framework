declare module iClock {
    declare class ClockInk extends inkbox.Ink {
        inkName: string;
        private m_current;
        private m_millisecond;
        private m_tailMillisecond;
        private static s_instance;
        static getInstance(): ClockInk;
        constructor();
        start(): number;
        shouldCallRun(): boolean;
        getTimeMS(): number;
        getMilliSeconds(): number;
        setTime(): void;
        run(): void;
    }
}