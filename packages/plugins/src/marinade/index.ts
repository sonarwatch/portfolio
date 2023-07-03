import {
  Context,
  FetcherExecutor,
  NetworkId,
  PortfolioAssetType,
  PortfolioElementSingle,
  PortfolioElementType,
  solanaNativeAddress,
} from '@sonarwatch/portfolio-core';

const fetcherExecutor: FetcherExecutor = async (
  owner: string,
  context: Context
) => {
  const { tokenPriceCache } = context;
  const solTokenPrice = await tokenPriceCache.get(
    solanaNativeAddress,
    NetworkId.solana
  );
  const amount = 10;
  const price = solTokenPrice?.price || null;
  const value = price ? amount * price : null;
  const element: PortfolioElementSingle = {
    networkId: NetworkId.solana,
    label: 'Deposit',
    platformId: 'marinade',
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
