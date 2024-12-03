import { suiNativeAddress } from '../constants';
import { isMoveTokenAddress, isSolanaTokenAddress } from './validTokenAddress';

describe('validTokenAddress', () => {
  it('should isSolanaTokenAddress', async () => {
    expect(
      isSolanaTokenAddress('11111111111111111111111111111111')
    ).toBeTruthy();
    expect(
      isSolanaTokenAddress('So11111111111111111111111111111111111111112')
    ).toBeTruthy();
  });

  it('should isMoveTokenAddress', async () => {
    expect(
      isMoveTokenAddress(
        '06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
      )
    ).toBeTruthy();
    expect(
      isMoveTokenAddress(
        '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
      )
    ).toBeTruthy();
    expect(
      isMoveTokenAddress(
        '0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
      )
    ).toBeTruthy();
    expect(isMoveTokenAddress('0x1::aptos_coin::AptosCoin')).toBeTruthy();
    expect(isMoveTokenAddress('0x2::sui::SUI')).toBeTruthy();
    expect(isMoveTokenAddress(suiNativeAddress)).toBeTruthy();
    expect(
      isMoveTokenAddress(
        '0x671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
      )
    ).toBeTruthy();

    expect(
      isMoveTokenAddress(
        '0x2::coin::Coin<0xc2edf324c59ad2481b47e327a710cb5353074af254560b3182d91b3a7feab6c0::PEPEGOAT::PEPEGOAT'
      )
    ).toBeFalsy();
  });
});
