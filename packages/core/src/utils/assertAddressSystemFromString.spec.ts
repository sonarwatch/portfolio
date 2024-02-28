import { assertAddressSystemFromString } from './assertAddressSystemFromString';

describe('assertAddressSystemFromString', () => {
  it('should works', () => {
    const addressSystem = assertAddressSystemFromString('move');
    expect(addressSystem).toBeDefined();
    expect(() => {
      assertAddressSystemFromString('NotAnAddressSystem');
    }).toThrow();
  });
});
