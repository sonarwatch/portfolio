import { assertAddressSystem } from './assertAddressSystem';

describe('assertAddressSystem', () => {
  it('should works', async () => {
    const addressSystem = assertAddressSystem('move');
    expect(addressSystem).toBeDefined();
    expect(() => {
      assertAddressSystem('NotAnAddressSystem');
    }).toThrow();
  });
});
