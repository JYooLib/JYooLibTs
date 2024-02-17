# JYooLibTs
JYOO Typescript Library

## index.d.ts
```ts
/** ===============================================
 * JYLib DataFormat
 * - Data format converters
 */
declare class JYLib_DataFormat {
    /**
     * Encodes utf8
     * @param src - input string
     * @returns ecoded string
     */
    static encodeUtf8(src: string): string;
    /**
     * Get CRC16
     * @param data - input string
     * @returns crc16
     */
    static crc16(data: string): number;
}

/** ===============================================
 * JYLib Timer
 * - Async sleeep
 * - Single timer: Requires restart when expires
 */
declare class JYLib_Timer {
    private cb;
    intervalMs: number;
    private tmr$;
    private tmrSubscription;
    /**
     * Creates an instance of jy timer.
     * @param cb - Callback when timer hits
     * @param [intervalMs] - Timer interval (ms), default=1000
     */
    constructor(cb: () => void, intervalMs?: number);
    /**
     * Sleeps for given duration
     * @param durationMs
     * @returns
     */
    static sleep(durationMs: number): Promise<unknown>;
    /**
     * Starts jy timer
     * @param [intervalMs] - Timer interval (ms), default=this.intervalMs
     * @param [runCbFirst] - Run callback first before timer starts, default=false
     * @returns
     */
    start(intervalMs?: number, runCbFirst?: boolean): void;
    /**
     * Stops jy timer
     */
    stop(): void;
    /**
     * Determines whether the timer is stopped
     * @returns boolean
     */
    isStopped(): boolean;
    /**
     * Expires jy timer
     * @param [expireAfterMs] - Optional time (ms) till the timer expires, default=0
     */
    expire(expireAfterMs?: number): void;
    private process;
}

export { JYLib_DataFormat, JYLib_Timer };

```