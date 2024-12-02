import { NetworkId, NetworkIdType } from '../Network';
import {
  solanaNativeAddress,
  solanaNativeWrappedAddress,
  suiNativeAddress,
} from '../constants';
import {
  formatMoveTokenAddress,
  formatTokenAddress,
} from './formatTokenAddress';

describe('formatTokenAddress', () => {
  it('should format Move token address correctly', () => {
    const fTokenAddress = formatMoveTokenAddress(
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI'
    );
    expect(fTokenAddress).toBe(
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI'
    );
    expect(formatMoveTokenAddress(fTokenAddress)).toBe(fTokenAddress);
    expect(formatMoveTokenAddress('0x2::sui::SUI')).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
    );
    expect(formatMoveTokenAddress('0x02::sui::SUI')).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
    );
    expect(formatMoveTokenAddress('0x002::sui::SUI')).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
    );
    expect(formatMoveTokenAddress(suiNativeAddress)).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
    );
    expect(
      formatMoveTokenAddress(
        '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
      )
    ).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
    );

    expect(formatMoveTokenAddress('0x1::aptos_coin::AptosCoin')).toBe(
      '0x1::aptos_coin::AptosCoin'
    );
    expect(
      formatMoveTokenAddress(
        '06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
    );
    expect(
      formatMoveTokenAddress(
        '6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
    );
    expect(
      formatMoveTokenAddress(
        '0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
    );
    expect(
      formatMoveTokenAddress(
        '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS'
    );

    expect(
      formatMoveTokenAddress(
        '0x671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
      )
    ).toBe(
      '0x00671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
    );

    expect(
      formatMoveTokenAddress(
        '671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
      )
    ).toBe(
      '0x00671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
    );

    expect(
      formatMoveTokenAddress(
        '0x00671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
      )
    ).toBe(
      '0x00671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
    );
  });
  it('should format Solana token address correctly', () => {
    const networkId: NetworkIdType = NetworkId.solana;
    const fTokenAddress = formatTokenAddress(solanaNativeAddress, networkId);
    const fTokenAddress2 = formatTokenAddress(
      solanaNativeWrappedAddress,
      networkId
    );
    expect(solanaNativeAddress).toBe(fTokenAddress);
    expect(solanaNativeWrappedAddress).toBe(fTokenAddress2);
  });
});
