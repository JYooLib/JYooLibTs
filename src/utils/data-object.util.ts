import { cloneDeep, isEqual } from 'lodash';

/** ===============================================
 * JYLib DataObject
 * - Object process utils
 */
export class JYLib_DataObject {
  /**
   * Get index of enum that matches to input val 
   * @template E - Enum type
   * @param e - Enum set
   * @param val - Enum value
   * @returns index of enum set 
   */
  static enumIndex<E>(e: any, val: E): number {
    let index = 0;
    for (const enumVal in e) {
      if (enumVal == e[val]) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /**
   * Objects is empty
   * @param val - Input object
   * @returns true if is empty 
   */
  static objectIsEmpty(val: any): boolean {
    if (val == undefined)
      return true;

    if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) == '[object Date]')
      return false;

    if (val == null || val.length == 0) // null or 0 length array
      return true;

    if (typeof (val) == "object") {
      var r = true;
      for (var prop in val) {
        if (val.hasOwnProperty(prop)) {
          r = false;
          break;
        }
      }
      return r;
    }
    return false;
  }

  /**
   * Objects copy
   * @param from - source object
   * @returns  
   */
  static objectCopy(from: any) {
    return cloneDeep(from);
  }
  
  /**
   * Objects equal
   * @param from1 - Source object1
   * @param from2 - Source object2
   * @param [filterKeys] - Optional filter keys
   * @returns true if equal 
   */
  static objectEqual(from1: any, from2: any, filterKeys?: string[]): boolean {
    if (filterKeys != undefined) {
      from1 = JYLib_DataObject.objectFiltered(from1, filterKeys);
      from2 = JYLib_DataObject.objectFiltered(from2, filterKeys);
    }
    return isEqual(from1, from2);
  }

  /**
   * Get object with fields that are filtered from filterKeys
   * @param from - Source object
   * @param filterKeys - fields that shall be filtered
   * @returns Object with fields that are filtered from filterKeys
   */
  static objectFiltered(from: any, filterKeys: string[]): any {
    const ret = Object.keys(from)
      .filter(key => filterKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = from[key];
        return obj;
      }, {});
    return ret;      
  }

  /**
   * Gets merged map with delta object
   * @param src - Source object
   * @param delta - Object with fields changed (delta)
   * @returns Merged map with delta 
   */
  static getMergedMapWithDelta(src: object, delta: object): object {
    if (src === undefined) {
      // Overwrite with delta
      return delta;
    }

    if (delta === undefined) {
      // Data missing in delta
      return src;
    }

    if (delta === null) {
      // Data became null
      return null;
    }

    if (src === null) {
      // Overwrite with delta
      return delta;
    }

    if (Array.isArray(src)) {
      // Overwrite with delta
      return delta;
    }

    if (typeof src == "object") {
      const mergedMap = { ...src, ...delta };

      Object.keys(mergedMap).forEach((key) => {
        mergedMap[key] = JYLib_DataObject.getMergedMapWithDelta(src[key], delta[key]);
      });
      return mergedMap;
    }

    // Overwrite with delta
    return delta;
  }

  /**
   * Sorts object keys
   * @param obj - Input object
   * @returns  Object with fields sorted
   */
  static sortObjectKeys(obj: any): any {
    if (obj === undefined) {
      return undefined;
    }

    if ( (obj === null) ||
        (typeof obj === 'string') ||
        (typeof obj === 'number') ) {
      return obj;
    }
    return Object.keys(obj).sort().reduce((res, key)=>{
        if (Array.isArray(obj[key])){
          res[key] = obj[key].map(JYLib_DataObject.sortObjectKeys);
        }
        else if (typeof obj[key] === 'object') {
          res[key] = JYLib_DataObject.sortObjectKeys(obj[key]);
        }
        else {
          res[key] = obj[key];
        }
        return res;
    },{});
  }
}