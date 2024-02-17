export function isValidIpv4Addr(ip) {
  return /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(ip);
}

export function ip2long(ip) {
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

export function long2ip(proper_address) {  
  // Converts an (IPv4) Internet network address into a string in Internet standard dotted format    
  //   
  // version: 812.316  
  // discuss at: http://phpjs.org/functions/long2ip  
  // +   original by: Waldo Malqui Silva  
  // *     example 1: long2ip( 3221234342 );  
  // *     returns 1: '192.0.34.166'  
    
  let output = '';  
    
  if ( !isNaN ( proper_address ) && ( proper_address >= 0 || proper_address <= 4294967295 ) ) {  
      output = Math.floor (proper_address / Math.pow ( 256, 3 ) ) + '.' +  
          Math.floor ( ( proper_address % Math.pow ( 256, 3 ) ) / Math.pow ( 256, 2 ) ) + '.' +  
          Math.floor ( ( ( proper_address % Math.pow ( 256, 3 ) )  % Math.pow ( 256, 2 ) ) / Math.pow ( 256, 1 ) ) + '.' +  
          Math.floor ( ( ( ( proper_address % Math.pow ( 256, 3 ) ) % Math.pow ( 256, 2 ) ) % Math.pow ( 256, 1 ) ) / Math.pow ( 256, 0 ) );  
  }  
    
  return output;  
}  

export function inSubNet(ip, subnet) {   
    var mask, base_ip, long_ip = ip2long(ip);
    if( (mask = subnet.match(/^(.*?)\/(\d{1,2})$/)) && ((base_ip=ip2long(mask[1])) >= 0) ) {
        var freedom = Math.pow(2, 32 - parseInt(mask[2]));
        return (long_ip > base_ip) && (long_ip < base_ip + freedom - 1);
    }
    else return false;
};

export function netmaskToCidr(mask: string) {
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

function intToBinary(int){
  var binStr = parseInt(int, 10).toString(2);
	binStr = "0".repeat(8 - binStr.length) + binStr;
	return binStr;
}

function binaryToInt(bin) {
	return parseInt(bin, 2);
}

export function getNetworkBaseAddr(ip: string, netmask: string) {
  var netBin = "";

  if ( (!isValidIpv4Addr(ip)) ||
       (!isValidIpv4Addr(netmask)) ) {
    return '';
  }

  let ipNums = ip.split('.');
  let netmaskNums = netmask.split('.');

  let ipB: string = '';
  for (let i = 0; i < ipNums.length; i++) {
    ipB += intToBinary(parseInt(ipNums[i], 10));
    if (i < ipNums.length - 1) {
      ipB += '.';
    }
  }

  let netmaskB: string = '';
  for (let i = 0; i < netmaskNums.length; i++) {
    netmaskB += intToBinary(parseInt(netmaskNums[i], 10));
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
    netStr += binaryToInt(net[i]);
    if (i < net.length - 1) {
      netStr += '.';
    }
  }
  return netStr;
};

export function getSubnet(ip: string, netmask: string) {
  let networkAddrBase = getNetworkBaseAddr(ip, netmask);
  return `${networkAddrBase}/${netmaskToCidr(netmask)}`;
}

export function getBaseUrl(url: string) {
  // example url="https://somedomain.com:port"
  var pathArray = url.split( '/' );
  var protocol = pathArray[0];
  var host = pathArray[2];
  var baseUrl = protocol + '//' + host;
  return baseUrl;
}

export function getBaseUrlWithoutPort(url: string) {
  let baseUrl = getBaseUrl(url);
  let portStrStartPos = baseUrl.lastIndexOf(':');
  if (portStrStartPos > 0) {
    baseUrl = baseUrl.substr(0, portStrStartPos);
  }
  return baseUrl;
}