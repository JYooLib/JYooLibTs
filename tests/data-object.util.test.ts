import { JYLib_DataObject } from '../src/utils/data-object.util';

describe('JYLib_DataObject', () => {
  describe('enumIndex', () => {
    enum TestEnum {
      FIRST = 'first',
      SECOND = 'second',
      THIRD = 'third'
    }

    it('should return the correct index for a given enum value', () => {
      const enumIdx = JYLib_DataObject.enumIndex(TestEnum, TestEnum.FIRST);
      console.log('>>> enumIdx:', enumIdx);
      expect(JYLib_DataObject.enumIndex(TestEnum, TestEnum.FIRST)).toBe(0);
      expect(JYLib_DataObject.enumIndex(TestEnum, TestEnum.SECOND)).toBe(1);
      expect(JYLib_DataObject.enumIndex(TestEnum, TestEnum.THIRD)).toBe(2);
    });

    it('should return -1 for a value not in the enum', () => {
      expect(JYLib_DataObject.enumIndex(TestEnum, 'fourth')).toBe(-1);
    });
  });

  describe('objectIsEmpty', () => {
    it('should return true for undefined', () => {
      expect(JYLib_DataObject.objectIsEmpty(undefined)).toBe(true);
    });

    it('should return true for null', () => {
      expect(JYLib_DataObject.objectIsEmpty(null)).toBe(true);
    });

    it('should return true for an empty object', () => {
      expect(JYLib_DataObject.objectIsEmpty({})).toBe(true);
    });

    it('should return false for a non-empty object', () => {
      expect(JYLib_DataObject.objectIsEmpty({ key: 'value' })).toBe(false);
    });

    it('should return true for an empty array', () => {
      expect(JYLib_DataObject.objectIsEmpty([])).toBe(true);
    });

    it('should return false for a non-empty array', () => {
      expect(JYLib_DataObject.objectIsEmpty([1, 2, 3])).toBe(false);
    });

    it('should return false for a number', () => {
      expect(JYLib_DataObject.objectIsEmpty(123)).toBe(false);
    });

    it('should return false for a boolean', () => {
      expect(JYLib_DataObject.objectIsEmpty(true)).toBe(false);
    });

    it('should return false for a function', () => {
      expect(JYLib_DataObject.objectIsEmpty(() => {})).toBe(false);
    });

    it('should return false for a date', () => {
      expect(JYLib_DataObject.objectIsEmpty(new Date())).toBe(false);
    });
  });

  describe('objectCopy', () => {
    it('should create a deep copy of an object', () => {
      const obj = { key: 'value', nested: { key: 'nestedValue' } };
      const copy = JYLib_DataObject.objectCopy(obj);
      expect(copy).toEqual(obj);
      expect(copy).not.toBe(obj);
      expect(copy.nested).not.toBe(obj.nested);
    });
  });

  describe('objectEqual', () => {
    it('should return true for equal objects', () => {
      const obj1 = { key: 'value', nested: { key: 'nestedValue' } };
      const obj2 = { key: 'value', nested: { key: 'nestedValue' } };
      expect(JYLib_DataObject.objectEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for different objects', () => {
      const obj1 = { key: 'value', nested: { key: 'nestedValue' } };
      const obj2 = { key: 'value', nested: { key: 'differentValue' } };
      expect(JYLib_DataObject.objectEqual(obj1, obj2)).toBe(false);
    });

    it('should return true for equal objects with filtered keys', () => {
      const obj1 = { key: 'value', nested: { key: 'nestedValue' }, extra: 'extraValue' };
      const obj2 = { key: 'value', nested: { key: 'nestedValue' }, extra: 'differentExtraValue' };
      expect(JYLib_DataObject.objectEqual(obj1, obj2, ['key', 'nested'])).toBe(true);
    });
  });

  describe('objectFiltered', () => {
    it('should return an object with only the filtered keys', () => {
      const obj = { key: 'value', nested: { key: 'nestedValue' }, extra: 'extraValue' };
      const filtered = JYLib_DataObject.objectFiltered(obj, ['key', 'nested']);
      expect(filtered).toEqual({ key: 'value', nested: { key: 'nestedValue' } });
    });
  });

  describe('getMergedMapWithDelta', () => {
    it('should merge two objects', () => {
      const src = { key1: 'value1', key2: 'value2' };
      const delta = { key2: 'newValue2', key3: 'value3' };
      const merged = JYLib_DataObject.getMergedMapWithDelta(src, delta);
      expect(merged).toEqual({ key1: 'value1', key2: 'newValue2', key3: 'value3' });
    });

    it('should handle undefined src', () => {
      const delta = { key2: 'newValue2', key3: 'value3' };
      const merged = JYLib_DataObject.getMergedMapWithDelta(undefined, delta);
      expect(merged).toEqual(delta);
    });

    it('should handle undefined delta', () => {
      const src = { key1: 'value1', key2: 'value2' };
      const merged = JYLib_DataObject.getMergedMapWithDelta(src, undefined);
      expect(merged).toEqual(src);
    });

    it('should handle null delta', () => {
      const src = { key1: 'value1', key2: 'value2' };
      const merged = JYLib_DataObject.getMergedMapWithDelta(src, null);
      expect(merged).toBeNull();
    });

    it('should handle array src', () => {
      const src = [1, 2, 3];
      const delta = [4, 5, 6];
      const merged = JYLib_DataObject.getMergedMapWithDelta(src, delta);
      expect(merged).toEqual(delta);
    });
  });

  describe('sortObjectKeys', () => {
    it('should sort the keys of an object', () => {
      const obj = { b: 1, a: 2, c: 3 };
      const sorted = JYLib_DataObject.sortObjectKeys(obj);
      expect(sorted).toEqual({ a: 2, b: 1, c: 3 });
    });

    it('should handle nested objects', () => {
      const obj = { b: { d: 4, c: 3 }, a: 2 };
      const sorted = JYLib_DataObject.sortObjectKeys(obj);
      expect(sorted).toEqual({ a: 2, b: { c: 3, d: 4 } });
    });

    it('should handle arrays', () => {
      const obj = { b: [3, 2, 1], a: 2 };
      const sorted = JYLib_DataObject.sortObjectKeys(obj);
      expect(sorted).toEqual({ a: 2, b: [3, 2, 1] });
    });
  });
});