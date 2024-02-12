import { solanaNativeAddress, solanaNativeWrappedAddress } from '../constants';
import { isSolanaAddress } from './validAddress';
import { isSolanaTokenAddress } from './validTokenAddress';

describe('validAddress', () => {
  it('should isSolanaAddress', async () => {
    expect(isSolanaAddress(solanaNativeAddress)).toBeTruthy();
    expect(isSolanaTokenAddress(solanaNativeAddress)).toBeTruthy();
    expect(isSolanaTokenAddress(solanaNativeWrappedAddress)).toBeTruthy();
  });
});
