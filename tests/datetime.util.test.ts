import { JYLib_Datetime } from '../src/utils/datetime.util';

describe('JYLib_Datetime', () => {
  describe('getMinimisedDurationStr', () => {
    it('should return minimised duration string in "mm:ss" format', () => {
      expect(JYLib_Datetime.getMinimisedDurationStr("01:02:03.456")).toBe("62:03");
      expect(JYLib_Datetime.getMinimisedDurationStr("00:02:03.456")).toBe("02:03");
    });

    it('should return the original string if the format is incorrect', () => {
      expect(JYLib_Datetime.getMinimisedDurationStr("02:03")).toBe("02:03");
    });
  });

  describe('utcDateTimeToMillisec', () => {
    it('should convert UTC date time string to milliseconds', () => {
      expect(JYLib_Datetime.utcDateTimeToMillisec("2023-01-01T00:00:00.000Z")).toBe(1672531200000);
    });
  });

  describe('durationStrToMillisec', () => {
    it('should convert duration string in "hh:mm:ss.zzz" format to milliseconds', () => {
      expect(JYLib_Datetime.durationStrToMillisec("01:02:03.456")).toBe(3723456);
    });

    it('should convert duration string in "mm:ss" format to milliseconds', () => {
      expect(JYLib_Datetime.durationStrToMillisec("02:03")).toBe(123000);
    });
  });

  describe('millisecToDurationStr', () => {
    it('should convert milliseconds to duration string in "dd.hh:mm:ss.zzz" format', () => {
      expect(JYLib_Datetime.millisecToDurationStr(3723456)).toBe("01:02:03.456");
      expect(JYLib_Datetime.millisecToDurationStr(90061000)).toBe("01.01:01:01.000");
    });
  });

  describe('fillMiniTimeStr', () => {
    it('should fill mini time string to "mm:ss" format', () => {
      expect(JYLib_Datetime.fillMiniTimeStr("2:3")).toBe("02:03");
      expect(JYLib_Datetime.fillMiniTimeStr("12:34")).toBe("12:34");
    });
  });
});