import { getAddressesFromElement } from './getAddressesFromElement';
import { LeverageSide, PortfolioElementType } from '../Portfolio';
import { NetworkId } from '../Network';

describe('getAddressesFromElement', () => {
  it('should return address for leverage element with address', async () => {
    const addresses = getAddressesFromElement({
      type: PortfolioElementType.leverage,
      networkId: NetworkId.solana,
      platformId: 'foo',
      value: 1,
      label: 'Leverage',
      data: {
        value: 1,
        positions: [
          {
            address: 'foo',
            sizeValue: 1,
            collateralValue: 1,
            value: 1,
            liquidationPrice: 1,
            pnlValue: 1,
            side: LeverageSide.long,
          },
        ],
      },
    });

    expect(addresses).toBeTruthy();
    expect(addresses[0]).toBeTruthy();
    expect(addresses[0]).toBe('foo');
  });

  it('should return nothing for leverage element without address', async () => {
    const addresses = getAddressesFromElement({
      type: PortfolioElementType.leverage,
      networkId: NetworkId.solana,
      platformId: 'foo',
      value: 1,
      label: 'Leverage',
      data: {
        value: 1,
        positions: [
          {
            sizeValue: 1,
            collateralValue: 1,
            value: 1,
            liquidationPrice: 1,
            pnlValue: 1,
            side: LeverageSide.long,
          },
        ],
      },
    });

    expect(addresses).toBeTruthy();
  });
});
