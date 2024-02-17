import { cloneDeep, isEqual } from 'lodash';

export function enumIndex<E>(e: any, val: E): number {
  let index = 0;
  for (const enumVal in e) {
    if (enumVal == e[val]) {
      return index;
    }
    index++;
  }
  return -1;
}

export function objectIsEmpty(val: any) {
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

export function objectCopy(from: any) {
  return cloneDeep(from);
}

export function objectEqual(from1: any, from2: any, filterKeys?: string[]) {
  if (filterKeys != undefined) {
    from1 = objectFiltered(from1, filterKeys);
    from2 = objectFiltered(from2, filterKeys);
  }
  return isEqual(from1, from2);
}

// Returns object with filtered key
export function objectFiltered(from: any, filterKeys: string[]): any {
  const ret = Object.keys(from)
    .filter(key => filterKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = from[key];
      return obj;
    }, {});
  return ret;      
}

export function getMergedMapWithDelta(src: object, delta: object): object {
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
      mergedMap[key] = getMergedMapWithDelta(src[key], delta[key]);
    });
    return mergedMap;
  }

  // Overwrite with delta
  return delta;
}

export function sortObjectKeys(obj: any){
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
        res[key] = obj[key].map(sortObjectKeys);
      }
      else if (typeof obj[key] === 'object') {
        res[key] = sortObjectKeys(obj[key]);
      }
      else {
        res[key] = obj[key];
      }
      return res;
  },{});
}