import {
  NetworkId,
  PortfolioElementMultiple,
  PortfolioElementType,
  bitcoinNetwork,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getMempoolEndpoint } from '../../../utils/clients';
import { getBalance } from '../../../utils/bitcoin/getBalance';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const endpoint = await getMempoolEndpoint();
  const amount = await getBalance(endpoint, owner);
  if (amount === 0) return [];

  const btcTokenPrice = await cache.getTokenPrice(
    bitcoinNetwork.native.address,
    NetworkId.bitcoin
  );

  const asset = tokenPriceToAssetToken(
    bitcoinNetwork.native.address,
    amount,
    NetworkId.bitcoin,
    btcTokenPrice
  );

  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.bitcoin,
    platformId: walletTokensPlatformId,
    label: 'Wallet',
    value: asset.value,
    data: {
      assets: [asset],
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatformId}-bitcoin`,
  networkId: NetworkId.bitcoin,
  executor,
};

export default fetcher;
