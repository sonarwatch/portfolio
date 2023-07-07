import { assertAddressSystem } from './assertAddressSystem';

describe('assertAddressSystem', () => {
  it('should works', () => {
    const addressSystem = assertAddressSystem('move');
    expect(addressSystem).toBeDefined();
    expect(() => {
      assertAddressSystem('NotAnAddressSystem');
    }).toThrow();
  });
});
