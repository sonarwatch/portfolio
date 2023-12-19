import {
  NetworkId,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  ethereumNativeAddress,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const ethTokenPrice = await cache.getTokenPrice(
    ethereumNativeAddress,
    NetworkId.ethereum
  );
  const amount = 2;
  const price = ethTokenPrice?.price || null;
  const value = price ? amount * price : null;

  const element: PortfolioElementMultiple = {
    networkId: NetworkId.ethereum,
    label: 'Deposit',
    platformId,
    type: PortfolioElementType.multiple,
    value,
    data: {
      assets: [
        {
          type: PortfolioAssetType.token,
          networkId: NetworkId.ethereum,
          value,
          attributes: {},
          data: {
            address: ethereumNativeAddress,
            amount,
            price,
          },
        },
      ],
    },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-position`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
