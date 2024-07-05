import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { tokenMarketIdlItem, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { Order } from './types';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import { mintsToAssets } from '../../utils/solana/mintsToAssets';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const dasUrl = getSolanaDasEndpoint();
  const connection = getClientSolana();

  const accounts = await getAutoParsedProgramAccounts<Order>(
    connection,
    tokenMarketIdlItem,
    [
      {
        memcmp: {
          bytes: owner,
          offset: 41,
        },
      },
    ]
  );

  if (accounts.length === 0) return [];

  const assetsByMint = await mintsToAssets(
    dasUrl,
    cache,
    accounts.map((acc) => acc.mint),
    accounts.map((acc) => new BigNumber(acc.count).toNumber())
  );

  const elements: PortfolioElement[] = [];
  const assets: PortfolioAsset[] = [...assetsByMint.values()];

  if (assets.length === 0) return [];

  elements.push({
    networkId: NetworkId.solana,
    label: 'Deposit',
    platformId,
    type: PortfolioElementType.multiple,
    value: getUsdValueSum(assets.map((a) => a.value)),
    name: 'Sell Orders',
    data: {
      assets,
    },
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-tokenmarket`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
