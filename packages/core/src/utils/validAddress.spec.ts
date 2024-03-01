import { solanaNativeAddress, solanaNativeWrappedAddress } from '../constants';
import { isEvmAddress, isMoveAddress, isSolanaAddress } from './validAddress';
import { isSolanaTokenAddress } from './validTokenAddress';

describe('validAddress', () => {
  it('should isSolanaAddress', async () => {
    expect(isSolanaAddress(solanaNativeAddress)).toBeTruthy();
    expect(isSolanaTokenAddress(solanaNativeAddress)).toBeTruthy();
    expect(isSolanaTokenAddress(solanaNativeWrappedAddress)).toBeTruthy();
  });

  it('should isEvmAddress', async () => {
    expect(
      isEvmAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    ).toBeTruthy();
    expect(
      isEvmAddress('0x08dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    ).toBeTruthy();
  });

  it('should isMoveAddress', async () => {
    expect(
      isMoveAddress(
        '0x0123456789123456789123456789123456789123456789123456789123456789'
      )
    ).toBeTruthy();
    expect(
      isMoveAddress(
        '0123456789123456789123456789123456789123456789123456789123456789'
      )
    ).toBeTruthy();
  });
});
