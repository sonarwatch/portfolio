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
    expect(
      formatMoveAddress(
        '6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
    );
    expect(
      formatMoveAddress(
        '06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
    );
    expect(
      formatMoveAddress(
        '0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
    );
    expect(
      formatMoveAddress(
        '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b'
    );
    expect(formatMoveAddress('0x1')).toBe('0x1');
  });
});
