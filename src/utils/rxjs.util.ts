import { Observable } from 'rxjs';
import { takeUntil, map, distinctUntilChanged } from 'rxjs/operators';
import { objectEqual } from './data-object.util';

function objectFiltered(from: any, filterKeys: string[]): any {
  const ret = Object.keys(from)
    .filter(key => filterKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = from[key];
      return obj;
    }, {});
  return ret;      
}

export function safeObserve<T>(observable: Observable<T>, subscribeUntil: Observable<any>, calledIfChanged: boolean = true, filterKeys: string[] = null): Observable<T> {
  return observable.pipe(
    takeUntil(subscribeUntil),
    map(data => {
      if (filterKeys == null) {
        // No filter, take all
        return data;
      }
      // emit only for filtered key
      return objectFiltered(data, filterKeys);
    }),
    // emit only if changed
    distinctUntilChanged(calledIfChanged ? objectEqual : (prev, cur) => {
      return false;
    })
  );
}