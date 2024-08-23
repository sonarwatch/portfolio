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
        '0x00671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88'
      )
    ).toBeTruthy();
    expect(
      isMoveAddress(
        '0x671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88'
      )
    ).toBeTruthy();

    expect(isMoveAddress('0x1')).toBeTruthy();
    expect(isMoveAddress('0x0001')).toBeTruthy();
    expect(isMoveAddress('0x00001')).toBeTruthy();
    expect(isMoveAddress('1')).toBeTruthy();
    expect(isMoveAddress('0x2')).toBeTruthy();
    expect(isMoveAddress('0x0002')).toBeTruthy();
    expect(isMoveAddress('0x00002')).toBeTruthy();
    expect(isMoveAddress('2')).toBeTruthy();

    expect(
      isMoveAddress(
        '0x166b12e98c51d86f0823c39b5555c557d6044822abe5cdb68f0fe761e5bffed08'
      )
    ).toBeFalsy();
    expect(
      isMoveAddress(
        '0x111111111111111111111111111111111111111111111111166b12e98c51d86f0823c39b5555c557d6044822abe5cdb68f0fe761e5bffed08'
      )
    ).toBeFalsy();

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
    expect(
      isMoveAddress(
        '0x671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88'
      )
    ).toBeTruthy();
    expect(
      isMoveAddress(
        '671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88'
      )
    ).toBeTruthy();
  });
});
