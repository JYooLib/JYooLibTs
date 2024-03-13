# JYooLibTs
JYOO Typescript Library

<br>

# Table of Contents
1. [Services](#Services)
2. [Utils](#Utils)

<br>

## 1. Services <a name="Services"></a>
```ts
import { LoggerService } from '@nestjs/common';

/** ===============================================
 * JYLib_LoggerService
 *
 * Creates log file every day and stores them in /logs directory
 * Also supports querying log files through query function.
 * Ref: https://docs.nestjs.com/techniques/logger, https://www.npmjs.com/package/winston-daily-rotate-file
 * Ref: https://github.com/winstonjs/winston
 * Ref: https://github.com/gremo/nest-winston
 *
 * NOTE: It is preferable to use LOG_XXX macro to write log.
 */
declare const LOG_ERROR: (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) => void;
declare const LOG_WARN: (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) => void;
declare const LOG_INFO: (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) => void;
declare const LOG_VERBOSE: (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) => void;
declare const LOG_DEBUG: (caller: any, msg?: string, trace?: any, loggerService?: JYLib_LoggerService) => void;
declare class JYLib_LoggerService implements LoggerService {
    logger: LoggerService;
    appName: string;
    constructor(appName: string, logLevel?: 'error' | 'warn' | 'info' | 'verbose' | 'debug');
    log(message: any, trace?: string, label?: string): any;
    error(message: any, trace?: string, label?: string): any;
    warn(message: any, trace?: string, label?: string): any;
    debug(message: any, trace?: string, label?: string): any;
    verbose(message: any, trace?: string, label?: string): any;
    /**
     * Writes log
     * @param caller
     * @param [message]
     * @param [trace]
     * @param [logLevel]
     */
    write(caller: any, message?: string, trace?: any, logLevel?: 'fatal' | 'error' | 'warn' | 'info' | 'verbose' | 'debug'): void;
}

/** ===============================================
 * JYLIb_HostExecService
 *
 * Execute command in the host
 *
 * Following env parameters are required:
 * - HOST_USER_PWD: host user id
 * - HOST_USER_ID: host user password
 * - HOST_IP: host ip address
 */
declare class JYLIb_HostExecService {
    private logger;
    constructor(logger: JYLib_LoggerService);
    /**
     * Executes command in the host
     * @param cmdStr - command line
     * @param [runAsSudo] - boolean
     * @returns execute error, null if no error
     */
    execute(cmdStr: string, runAsSudo?: boolean): Promise<any>;
}

export { JYLIb_HostExecService, JYLib_LoggerService, LOG_DEBUG, LOG_ERROR, LOG_INFO, LOG_VERBOSE, LOG_WARN };

```

<br>

## 2. Utils <a name="Utils"></a>
```ts
import { Observable } from 'rxjs';

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
 * JYLib DataObject
 * - Object process utils
 */
declare class JYLib_DataObject {
    /**
     * Get index of enum that matches to input val
     * @template E - Enum type
     * @param e - Enum set
     * @param val - Enum value
     * @returns index of enum set
     */
    static enumIndex<E>(e: any, val: E): number;
    /**
     * Objects is empty
     * @param val - Input object
     * @returns true if is empty
     */
    static objectIsEmpty(val: any): boolean;
    /**
     * Objects copy
     * @param from - source object
     * @returns
     */
    static objectCopy(from: any): any;
    /**
     * Objects equal
     * @param from1 - Source object1
     * @param from2 - Source object2
     * @param [filterKeys] - Optional filter keys
     * @returns true if equal
     */
    static objectEqual(from1: any, from2: any, filterKeys?: string[]): boolean;
    /**
     * Get object with fields that are filtered from filterKeys
     * @param from - Source object
     * @param filterKeys - fields that shall be filtered
     * @returns Object with fields that are filtered from filterKeys
     */
    static objectFiltered(from: any, filterKeys: string[]): any;
    /**
     * Gets merged map with delta object
     * @param src - Source object
     * @param delta - Object with fields changed (delta)
     * @returns Merged map with delta
     */
    static getMergedMapWithDelta(src: object, delta: object): object;
    /**
     * Sorts object keys
     * @param obj - Input object
     * @returns  Object with fields sorted
     */
    static sortObjectKeys(obj: any): any;
}

/** ===============================================
 * JYLib Datetime
 * - Datetime related functions
 */
declare class JYLib_Datetime {
    /**
     * Gets minimised duration str
     * @param srcStr - source string, format="hh:mm:ss.zzz"
     * @returns minimised duration str, format="mm:ss"
     */
    static getMinimisedDurationStr(srcStr: string): string;
    /**
     * Utcs date time to millisec
     * @param srcUtcTime - Source UTC time string, format="yyyy-MM-ddTHH:mm:ss.zzzZ"
     * @returns date time to millisec
     */
    static utcDateTimeToMillisec(srcUtcTime: string): number;
    /**
     * Durations str to millisec
     * @param durationStr - Duration string, format="hh:mm:ss.zzz" or "12:34"
     * @returns str to millisec
     */
    static durationStrToMillisec(durationStr: any): number;
    /**
     * Millisecs to duration str
     * @param msec
     * @returns to duration str, format="dd.hh:mm:ss.zzz"
     */
    static millisecToDurationStr(msec: number): string;
    /**
     * Fills mini time str (e.g. m:ss, m:s)
     * @param value - Source string with space
     * @returns mini time str, format="mm:ss"
     */
    static fillMiniTimeStr(value: string): string;
}

/** ===============================================
 * JYLib Guid
 * - GUID management
 */
declare class JYLib_Guid {
    /**
     * Generate new guid
     * @returns  guid
     */
    static newGuid(): string;
}

/** ===============================================
 * JYLib Network
 * - Network utils
 */
declare class JYLib_Network {
    /**
     * Determines whether valid ipv4 addr is
     * @param ip
     * @returns True if ip is valid IP v4 format
     */
    static isValidIpv4Addr(ip: string): boolean;
    /**
     * Convert IP string to long
     * @param ip
     * @returns long
     */
    static ip2long(ip: string): number;
    /**
   * Convert long to IP string
   *     example: long2ip( 3221234342 );
   *     returns: '192.0.34.166' *
   * @param proper_address - IP address in long
   * @returns IP string
   */
    static long2ip(proper_address: number): string;
    /**
     * Determines whether ip and subnet are valid
     * @param ip
     * @param subnet
     * @returns true if sub net
     */
    static inSubNet(ip: string, subnet: string): boolean;
    /**
     * Netmasks to CIDR
     * @param mask
     * @returns CIDR number
     */
    static netmaskToCidr(mask: string): number;
    /**
     * Gets network base addr
     * @param ip
     * @param netmask
     * @returns network base addr
     */
    static getNetworkBaseAddr(ip: string, netmask: string): string;
    /**
     * Gets subnet
     * @param ip
     * @param netmask
     * @returns subnet
     */
    static getSubnet(ip: string, netmask: string): string;
    /**
     * Gets base url
     * @param url
     * @returns base url
     */
    static getBaseUrl(url: string): string;
    /**
     * Gets base url without port
     * @param url
     * @returns base url without port
     */
    static getBaseUrlWithoutPort(url: string): string;
    private static intToBinary;
    private static binaryToInt;
}

/** ===============================================
 * JYLib RxJS
 * - RxJS Helper functions
 */
declare class JYLib_Rxjs {
    /**
     * Observe with lifecyle condition and filter fields
     * @template T - Template for Observable data type
     * @param observable
     * @param subscribeUntil - Define subscribe lifecycle
     * @param [calledIfChanged] - True if only observed if data changed
     * @param [filterKeys] - Define fields to be filtered, if null, all fields are observed
     * @returns osbservable
     *
     * @description
     *
     * - Subscription example:
     *
     *    // Declare unsubscribe subject
     *    let unsubscribeAll: Subject<void> = new Subject();
     *
     *    // Declare subscription
     *    safeObserve(observable$, unsubscribeAll).subscribe((data) => { // Do something with data });
     *
     *    // Close the subscription
     *    unsubscribeAll.next();
     *    unsubscribeAll.complete();
     */
    static safeObserve<T>(observable: Observable<T>, subscribeUntil: Observable<any>, calledIfChanged?: boolean, filterKeys?: string[]): Observable<T>;
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

/** ===============================================
 * JYLib WS Client
 * - Websocket client wrapper
 */
declare class JYLib_WsClient<T> {
    private socket;
    private subscription;
    /**
     * Connect to server
     * @param url - Server URL
     * @param onRxMsg - Callback when msg received
     * @param onErr - Callback when error occured
     */
    connect(url: string, onRxMsg: (msg: T) => void, onErr: (err: any) => void): void;
    /**
     * Disconnect from server
     */
    disconnect(): void;
    /**
     * Determines whether connected is
     * @returns true if connected
     */
    isConnected(): boolean;
    /**
     * Sends message
     * @param msg
     */
    tx(msg: T): void;
}

export { JYLib_DataFormat, JYLib_DataObject, JYLib_Datetime, JYLib_Guid, JYLib_Network, JYLib_Rxjs, JYLib_Timer, JYLib_WsClient };

```

<br>