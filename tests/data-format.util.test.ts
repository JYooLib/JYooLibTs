import { JYLib_DataFormat } from '../src/utils/data-format.util';

describe('JYLib_DataFormat', () => {
  describe('encodeUtf8', () => {
    it('should encode a simple string to utf8', () => {
      const input = 'hello';
      const expectedOutput = 'hello';
      expect(JYLib_DataFormat.encodeUtf8(input)).toBe(expectedOutput);
    });

    it('should encode a string with special characters to utf8', () => {
      const input = 'こんにちは';
      const expectedOutput = '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF';
      expect(JYLib_DataFormat.encodeUtf8(input)).toBe(expectedOutput);
    });

    it('should encode an empty string to utf8', () => {
      const input = '';
      const expectedOutput = '';
      expect(JYLib_DataFormat.encodeUtf8(input)).toBe(expectedOutput);
    });
  });

  describe('crc16', () => {
    it('should calculate the correct CRC16 for a simple string', () => {
      const input = 'hello';
      const expectedOutput = 0x34D2;
      expect(JYLib_DataFormat.crc16(input)).toBe(expectedOutput);
    });

    it('should calculate the correct CRC16 for a string with special characters', () => {
      const input = 'こんにちは';
      const expectedOutput = 0xD5B8;
      expect(JYLib_DataFormat.crc16(input)).toBe(expectedOutput);
    });

    it('should calculate the correct CRC16 for an empty string', () => {
      const input = '';
      const expectedOutput = 0xFFFF;
      expect(JYLib_DataFormat.crc16(input)).toBe(expectedOutput);
    });
  });
});