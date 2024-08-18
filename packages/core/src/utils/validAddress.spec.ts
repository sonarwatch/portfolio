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
    // vitalik.eth
    expect(
      isEvmAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    ).toBeTruthy();
    expect(
      isEvmAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    ).toBeTruthy();
    expect(
      isEvmAddress('d8da6bf26964af9d7eed9e03e53415d37aa96045')
    ).toBeTruthy();
    expect(
      isEvmAddress('d8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    ).toBeTruthy();

    expect(
      isEvmAddress('0x0123456789999999999999999999999999999999')
    ).toBeTruthy();
    expect(
      isEvmAddress('0x123456789999999999999999999999999999999')
    ).toBeFalsy();
    expect(isEvmAddress('123456789999999999999999999999999999999')).toBeFalsy();
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
    expect(
      isMoveAddress(
        '0x123456789123456789123456789123456789123456789123456789123456789'
      )
    ).toBeTruthy();
    expect(
      isMoveAddress(
        '123456789123456789123456789123456789123456789123456789123456789'
      )
    ).toBeTruthy();
  });
});
