import { Observable, Subscription, timer } from 'rxjs';

/** ===============================================
 * JYLib Timer
 * - Async sleeep
 * - Single timer: Requires restart when expires
 */
export class JYLib_Timer {

private tmr$: Observable<number> = null;
private tmrSubscription: Subscription = null;

/**
 * Creates an instance of jy timer.
 * @param cb - Callback when timer hits
 * @param [intervalMs] - Timer interval (ms), default=1000
 */
constructor(private cb: () => void,
    public intervalMs: number = 1000) {
  }

  /**
   * Sleeps for given duration
   * @param durationMs 
   * @returns  
   */
  static sleep(durationMs: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, durationMs);
    });
  }

  /**
   * Starts jy timer
   * @param [intervalMs] - Timer interval (ms), default=this.intervalMs
   * @param [runCbFirst] - Run callback first before timer starts, default=false
   * @returns  
   */
  public start(intervalMs: number = this.intervalMs, runCbFirst: boolean = false) {
    
    this.stop();

    if ( (this.tmr$ == null) ||
         (this.intervalMs != intervalMs) ) {
      // Timer needs initialisation
      this.intervalMs = intervalMs;
      this.tmr$ = timer(this.intervalMs);
    }

    if (runCbFirst) {
      // Run Cb first then start timer
      this.tmrSubscription = this.tmr$.subscribe(t => {});
      this.process();
      return;
    }

    // Start timer
    this.tmrSubscription = this.tmr$.subscribe(t => {
      this.process();
    });
  }

  /**
   * Stops jy timer
   */
  public stop() {
    // TODO: this should be called from the client when destroyed. It can be forgotten by user. Is there anyway to automate this?
    if (this.tmrSubscription != null) {
      this.tmrSubscription.unsubscribe();
      this.tmrSubscription = null;
    }
  }

  /**
   * Determines whether the timer is stopped
   * @returns boolean
   */
  public isStopped(): boolean {
    return this.tmrSubscription == null;
  }

  /**
   * Expires jy timer
   * @param [expireAfterMs] - Optional time (ms) till the timer expires, default=0
   */
  public expire(expireAfterMs: number = 0) {
    if (expireAfterMs == 0) {
      this.process(false);
    } else {
      setTimeout(() => {
        this.process(false);
      }, expireAfterMs);
    }
  }

  private process(confirmStopped: boolean = true) {
    if ( (confirmStopped) &&
         (this.isStopped()) ) {
      // Tmr stopped
      return;
    }

    // Stop tmr
    this.stop();

    // Run callback
    this.cb();

    if (this.isStopped()) {
      // Tmr stopped by cb(). Let cb() to start the timer manually.
      return;
    } 

    // Resume tmr
    this.start();
  }
}