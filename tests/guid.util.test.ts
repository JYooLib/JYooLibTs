import { JYLib_Guid, EMPTY_GUID } from '../src/utils/guid.util';

describe('JYLib_Guid', () => {
  it('should generate a new GUID', () => {
    const guid = JYLib_Guid.newGuid();
    expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should generate unique GUIDs', () => {
    const guid1 = JYLib_Guid.newGuid();
    const guid2 = JYLib_Guid.newGuid();
    expect(guid1).not.toBe(guid2);
  });

  it('should have a valid EMPTY_GUID', () => {
    expect(EMPTY_GUID).toBe('00000000-0000-0000-0000-000000000000');
  });
});