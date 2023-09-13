import { isBlankAddressAptos } from './isBlankAddressAptos';

describe('isBlankAddressAptos', () => {
  it('should be blank address', async () => {
    const address =
      '0x2b4e042b276747cc603f99017ac4a63d8d04060ad18e3cb3834c0d648983b9dc';
    const isBlank = await isBlankAddressAptos(address);
    expect(isBlank).toEqual(true);
  });
});
