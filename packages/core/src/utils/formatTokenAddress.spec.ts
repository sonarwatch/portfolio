import { NetworkId, NetworkIdType } from '../Network';
import { suiNativeAddress } from '../constants';
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
  });
});
