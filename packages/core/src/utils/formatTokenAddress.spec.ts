import { NetworkId, NetworkIdType } from '../Network';
import {
  solanaNativeAddress,
  solanaNativeWrappedAddress,
  suiNativeAddress,
} from '../constants';
import { formatTokenAddress } from './formatTokenAddress';

describe('formatTokenAddress', () => {
  it('should format SUI token address correctly', () => {
    const networkId: NetworkIdType = NetworkId.sui;

    const fTokenAddress = formatTokenAddress(
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
      networkId
    );
    expect(fTokenAddress).toBe(
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc-afsui-AFSUI'
    );
    expect(formatTokenAddress(fTokenAddress, networkId)).toBe(fTokenAddress);
    expect(formatTokenAddress('0x2::sui::SUI', networkId)).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002-sui-SUI'
    );
    expect(formatTokenAddress(suiNativeAddress, networkId)).toBe(
      '0x0000000000000000000000000000000000000000000000000000000000000002-sui-SUI'
    );

    expect(
      formatTokenAddress(
        '06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
        networkId
      )
    ).toBe(
      '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b-cetus-CETUS'
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
