import { Observable } from 'rxjs';
import { takeUntil, map, distinctUntilChanged } from 'rxjs/operators';
import { JYLib_DataObject } from './data-object.util';

/** ===============================================
 * JYLib RxJS
 * - RxJS Helper functions
 */
export class JYLib_Rxjs {

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
  static safeObserve<T>(observable: Observable<T>, subscribeUntil: Observable<any>, calledIfChanged: boolean = true, filterKeys: string[] = null): Observable<T> {
    return observable.pipe(
      takeUntil(subscribeUntil),
      map(data => {
        if (filterKeys == null) {
          // No filter, take all
          return data;
        }
        // emit only for filtered key
        return JYLib_DataObject.objectFiltered(data, filterKeys);
      }),
      // emit only if changed
      distinctUntilChanged(calledIfChanged ? JYLib_DataObject.objectEqual : (prev, cur) => {
        return false;
      })
    );
  }
}