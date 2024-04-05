import { formatMoveAddress } from './formatAddress';

describe('formatAddress', () => {
  it('should formatMoveAddress', () => {
    expect(
      formatMoveAddress(
        '0123456789012345678901234567890123456789012345678901234567890123'
      )
    ).toBe(
      '0x0123456789012345678901234567890123456789012345678901234567890123'
    );
  });
});
