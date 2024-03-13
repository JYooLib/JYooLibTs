/** ===============================================
 * JYLib Guid
 * - GUID management
 */

export type GUID = string;
export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export class JYLib_Guid {

  /**
   * Generate new guid
   * @returns  guid
   */
  static newGuid() {
    var dt = new Date().getTime();
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return guid;
  }
}