/** ===============================================
 * JYLib Network
 * - Network utils
 */
export class JYLib_Network {

  /**
   * Determines whether valid ipv4 addr is
   * @param ip 
   * @returns True if ip is valid IP v4 format
   */
  static isValidIpv4Addr(ip: string): boolean {
    return /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(ip);
  }

  /**
   * Convert IP string to long
   * @param ip 
   * @returns long
   */
  static ip2long(ip: string): number {
    var components;

    if (components = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)) {
        var iplong = 0;
        var power  = 1;
        for(var i=4; i>=1; i-=1)
        {
            iplong += power * parseInt(components[i]);
            power  *= 256;
        }
        return iplong;
    }
    else return -1;
  };

    /**
   * Convert long to IP string
   *     example: long2ip( 3221234342 );  
   *     returns: '192.0.34.166' * 
   * @param proper_address - IP address in long
   * @returns IP string
   */
  static long2ip(proper_address: number): string {  
    let output = '';  
      
    if ( !isNaN ( proper_address ) && ( proper_address >= 0 || proper_address <= 4294967295 ) ) {  
        output = Math.floor (proper_address / Math.pow ( 256, 3 ) ) + '.' +  
            Math.floor ( ( proper_address % Math.pow ( 256, 3 ) ) / Math.pow ( 256, 2 ) ) + '.' +  
            Math.floor ( ( ( proper_address % Math.pow ( 256, 3 ) )  % Math.pow ( 256, 2 ) ) / Math.pow ( 256, 1 ) ) + '.' +  
            Math.floor ( ( ( ( proper_address % Math.pow ( 256, 3 ) ) % Math.pow ( 256, 2 ) ) % Math.pow ( 256, 1 ) ) / Math.pow ( 256, 0 ) );  
    }  
      
    return output;  
  }  

  /**
   * Determines whether ip and subnet are valid
   * @param ip 
   * @param subnet 
   * @returns true if sub net 
   */
  static inSubNet(ip: string, subnet: string): boolean {   
      var mask, base_ip, long_ip = JYLib_Network.ip2long(ip);
      if( (mask = subnet.match(/^(.*?)\/(\d{1,2})$/)) && ((base_ip=JYLib_Network.ip2long(mask[1])) >= 0) ) {
          var freedom = Math.pow(2, 32 - parseInt(mask[2]));
          return (long_ip > base_ip) && (long_ip < base_ip + freedom - 1);
      }
      else return false;
  };

  /**
   * Netmasks to CIDR
   * @param mask 
   * @returns CIDR number
   */
  static netmaskToCidr(mask: string): number {
    var cidr: string = '';
    let maskBytes = mask.toString().split('.');
    for (let m of maskBytes) {
        if (parseInt(m)>255) {throw 'ERROR: Invalid Netmask'} // Check each group is 0-255
        if (parseInt(m)>0 && parseInt(m)<128) {throw 'ERROR: Invalid Netmask'}

        cidr += (parseInt(m) >>> 0).toString(2)
    }
    // Condition to check for validity of the netmask
    if (cidr.substring(cidr.search('0'),32).search('1') !== -1) {
        throw 'ERROR: Invalid Netmask ' + mask
    }
    return cidr.split('1').length-1
  }

  /**
   * Gets network base addr
   * @param ip 
   * @param netmask 
   * @returns network base addr 
   */
  static getNetworkBaseAddr(ip: string, netmask: string): string {
    var netBin = "";

    if ( (!JYLib_Network.isValidIpv4Addr(ip)) ||
        (!JYLib_Network.isValidIpv4Addr(netmask)) ) {
      return '';
    }

    let ipNums = ip.split('.');
    let netmaskNums = netmask.split('.');

    let ipB: string = '';
    for (let i = 0; i < ipNums.length; i++) {
      ipB += JYLib_Network.intToBinary(parseInt(ipNums[i], 10));
      if (i < ipNums.length - 1) {
        ipB += '.';
      }
    }

    let netmaskB: string = '';
    for (let i = 0; i < netmaskNums.length; i++) {
      netmaskB += JYLib_Network.intToBinary(parseInt(netmaskNums[i], 10));
      if (i < netmaskNums.length - 1) {
        netmaskB += '.';
      }
    }

    for(var i = 0; i < 35; i++) {
      if (ipB[i] == netmaskB[i]) {
        netBin += ipB[i];
      } else {
        netBin += "0";
      }
    }
    var net = netBin.split(".");
    let netStr = '';
    for (let i = 0; i < net.length; i++) {
      netStr += JYLib_Network.binaryToInt(net[i]);
      if (i < net.length - 1) {
        netStr += '.';
      }
    }
    return netStr;
  };

  /**
   * Gets subnet
   * @param ip 
   * @param netmask 
   * @returns subnet 
   */
  static getSubnet(ip: string, netmask: string): string {
    let networkAddrBase = JYLib_Network.getNetworkBaseAddr(ip, netmask);
    return `${networkAddrBase}/${JYLib_Network.netmaskToCidr(netmask)}`;
  }

  /**
   * Gets base url
   * @param url 
   * @returns base url 
   */
  static getBaseUrl(url: string): string {
    // example url="https://somedomain.com:port"
    var pathArray = url.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    var baseUrl = protocol + '//' + host;
    return baseUrl;
  }

  /**
   * Gets base url without port
   * @param url 
   * @returns base url without port 
   */
  static getBaseUrlWithoutPort(url: string): string {
    let baseUrl = JYLib_Network.getBaseUrl(url);
    let portStrStartPos = baseUrl.lastIndexOf(':');
    if (portStrStartPos > 0) {
      baseUrl = baseUrl.substr(0, portStrStartPos);
    }
    return baseUrl;
  }

  private static intToBinary(int: any): string{
    var binStr = parseInt(int, 10).toString(2);
    binStr = "0".repeat(8 - binStr.length) + binStr;
    return binStr;
  }

  private static binaryToInt(bin: any): number {
    return parseInt(bin, 2);
  }  
}