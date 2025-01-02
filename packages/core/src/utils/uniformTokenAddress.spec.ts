import { uniformMoveTokenAddress } from './uniformTokenAddress';

describe('uniformTokenAddress', () => {
  it('should uniform sui token address', async () => {
    expect(uniformMoveTokenAddress('0x002::sui::SUI')).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
    );
  });
});
