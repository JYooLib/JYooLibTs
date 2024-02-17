export function getMinimisedDurationStr(srcStr: string) {
  // Convert from "hh:mm:ss.zzz" to "mm:ss"
  const strList: string[] = srcStr.split(":");
  if (strList.length >= 3) {
      const hour: number = parseInt(strList[0]);
      const min: number = parseInt(strList[1]) + (hour * 60);
      const secStr: string = strList[2].split(".")[0];
      let minStr: string = min.toString();
      if (minStr.length < 2) {
          minStr = "0" + minStr;
      }
      const durationStr = minStr + ":" + secStr;
      return durationStr;
  }
  return srcStr;
}

export function utcDateTimeToMillisec(srcUtcTime: string) {
  //"yyyy-MM-ddTHH:mm:ss.zzzZ"
  return Date.parse(srcUtcTime);
}

export function durationStrToMillisec(durationStr) {
    var strList = durationStr.split(":");
    if (strList.length > 2) {
        // durationStr format: "hh:mm:ss.zzz";
        var day = 0;
        var hour = parseInt(strList[0]);
        var dayAndHourList = strList[0].split(".");
        if (dayAndHourList.length > 1) {
            day = parseInt(dayAndHourList[0]);
            hour = parseInt(dayAndHourList[1]);
        }

        var min = parseInt(strList[1]);
        var secAndmsecList = strList[2].split(".");
        var sec = parseInt(secAndmsecList[0]);
        var msec = (secAndmsecList.length > 1) ? parseInt(secAndmsecList[1]) : 0;
        return (msec) + (sec * 1000) + (min * 60 * 1000) + (hour * 60 * 60 * 1000) + (day * 60 * 60 * 1000 * 24);
    }
    else
    {
        // durationStr format: "12:34"
        var strBuf = durationStr;
        strBuf = strBuf.replace(/-/g, "0");
        strBuf = strBuf.replace(/ /g, "0");
        var minutes = parseInt(strBuf.substr(0, 2));
        var seconds = parseInt(strBuf.substr(3, 2));
        return (seconds + (minutes * 60)) * 1000;
    }
}

export function millisecToDurationStr(msec: number) {
    var sec = Math.floor(msec / 1000);
    msec = msec % 1000;
    var min =  Math.floor(sec / 60);
    sec = sec % 60;
    var hour =  Math.floor(min / 60);
    min = min % 60;
    var day = Math.floor(hour / 24);
    hour = hour % 24;

    let msecStr = msec.toString();
    let secStr = sec.toString();
    let minStr = min.toString();
    let hourStr = hour.toString();
    let dayStr = day.toString();

    while (msecStr.length < 3)
    {
      msecStr = "0" + msecStr;
    }

    while (secStr.length < 2)
    {
      secStr = "0" + secStr;
    }

    while (minStr.length < 2)
    {
      minStr = "0" + minStr;
    }

    while (hourStr.length < 2)
    {
      hourStr = "0" + hourStr;
    }

    return ((dayStr === "0") ? "" : (dayStr + ".")) + hourStr + ":" + minStr + ":" + secStr + "." + msecStr.substring(0, 3);
}

//make incomplete mini time str complete.
export function fillMiniTimeStr(value: string): string {

  let result: string = value.replace(':', '');

  while (result.length < 4) {
    result = `0${result}`;
  }

  result = [result.slice(0, -2), ':', result.slice(-2)].join('');
  return result;
}
