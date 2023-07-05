import {
  Context,
  FetcherExecutor,
  NetworkId,
  PortfolioAssetType,
  PortfolioElementSingle,
  PortfolioElementType,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';
import { platformId } from './constants';

const fetcherExecutor: FetcherExecutor = async (
  owner: string,
  context: Context
) => {
  const { cache } = context;
  const solTokenPrice = await cache.getTokenPrice(
    solanaNativeAddress,
    NetworkId.solana
  );
  const amount = 10;
  const price = solTokenPrice?.price || null;
  const value = price ? amount * price : null;
  const element: PortfolioElementSingle = {
    networkId: NetworkId.solana,
    label: 'Deposit',
    platformId,
    type: PortfolioElementType.single,
    value,
    data: {
      asset: {
        type: PortfolioAssetType.token,
        networkId: NetworkId.solana,
        value,
        data: {
          address: solanaNativeAddress,
          amount,
          price,
        },
      },
    },
  };
  return [element];
};
export default fetcherExecutor;
