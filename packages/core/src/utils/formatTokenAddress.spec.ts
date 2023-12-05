import { NetworkIdType } from '../Network';
import { formatTokenAddress } from './formatTokenAddress';

describe('formatTokenAddress', () => {
  it('should format SUI token address correctly', () => {
    const tokenAddress =
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI';
    const networkId: NetworkIdType = 'sui';
    const formattedAddress = formatTokenAddress(tokenAddress, networkId);
    expect(formattedAddress).toBe(
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc-afsui-AFSUI'
    );
  });
});
