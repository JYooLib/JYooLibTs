import { Observable, Subscription, timer } from 'rxjs';

export class JY_Timer {

  private tmr$: Observable<number> = null;
  private tmrSubscription: Subscription = null;

  constructor(private cb: () => void,
    public intervalMs: number = 1000) {
  }

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

  public stop() {
    // TODO: this should be called from the client when destroyed. It can be forgotten by user. Is there anyway to automate this?
    if (this.tmrSubscription != null) {
      this.tmrSubscription.unsubscribe();
      this.tmrSubscription = null;
    }
  }

  public isStopped() {
    return this.tmrSubscription == null;
  }

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