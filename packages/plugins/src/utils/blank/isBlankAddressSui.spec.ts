import { isBlankAddressSui } from './isBlankAddressSui';

describe('isBlankAddressSui', () => {
  it('should be blank address', async () => {
    const address =
      '0xb52b420df5996e66d09d277f49cd9e26313094c9ad94a7eed3778f39ec657c27';
    const isBlank = await isBlankAddressSui(address);
    expect(isBlank).toEqual(true);
  });
});
