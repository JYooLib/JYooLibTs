import { Subject, of } from 'rxjs';
import { JYLib_Rxjs } from '../src/utils/rxjs.util';
import { JYLib_DataObject } from '../src/utils/data-object.util';

describe('JYLib_Rxjs', () => {
  describe('safeObserve', () => {
    it('should complete the observable when subscribeUntil emits', (done) => {
      const observable$ = of(1, 2, 3);
      const unsubscribe$ = new Subject<void>();

      const result$ = JYLib_Rxjs.safeObserve(observable$, unsubscribe$);
      const results: number[] = [];

      result$.subscribe({
        next: (value) => results.push(value),
        complete: () => {
          expect(results).toEqual([1, 2, 3]);
          done();
        }
      });

      unsubscribe$.next();
      unsubscribe$.complete();
    });

    it('should filter fields if filterKeys is provided', (done) => {
      const observable$ = of({ a: 1, b: 2, c: 3 });
      const unsubscribe$ = new Subject<void>();
      const filterKeys = ['a', 'c'];

      jest.spyOn(JYLib_DataObject, 'objectFiltered').mockReturnValue({ a: 1, c: 3 });

      const result$ = JYLib_Rxjs.safeObserve(observable$, unsubscribe$, true, filterKeys);
      const results: any[] = [];

      result$.subscribe({
        next: (value) => results.push(value),
        complete: () => {
          expect(results).toEqual([{ a: 1, c: 3 }]);
          done();
        }
      });

      unsubscribe$.next();
      unsubscribe$.complete();
    });

    it('should emit only if data changed when calledIfChanged is true', (done) => {
      const observable$ = of({ a: 1 }, { a: 1 }, { a: 2 });
      const unsubscribe$ = new Subject<void>();

      jest.spyOn(JYLib_DataObject, 'objectEqual').mockImplementation((a, b) => JSON.stringify(a) === JSON.stringify(b));

      const result$ = JYLib_Rxjs.safeObserve(observable$, unsubscribe$, true);
      const results: any[] = [];

      result$.subscribe({
        next: (value) => results.push(value),
        complete: () => {
          expect(results).toEqual([{ a: 1 }, { a: 2 }]);
          done();
        }
      });

      unsubscribe$.next();
      unsubscribe$.complete();
    });

    it('should emit all values when calledIfChanged is false', (done) => {
      const observable$ = of({ a: 1 }, { a: 1 }, { a: 2 });
      const unsubscribe$ = new Subject<void>();

      const result$ = JYLib_Rxjs.safeObserve(observable$, unsubscribe$, false);
      const results: any[] = [];

      result$.subscribe({
        next: (value) => results.push(value),
        complete: () => {
          expect(results).toEqual([{ a: 1 }, { a: 1 }, { a: 2 }]);
          done();
        }
      });

      unsubscribe$.next();
      unsubscribe$.complete();
    });
  });
});