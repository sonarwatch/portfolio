import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { famousTokenMarketIdlItem, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { Order } from './types';
import { getAssetBatchDasAsMap } from '../../utils/solana/das/getAssetBatchDas';
import getSolanaDasEndpoint from '../../utils/clients/getSolanaDasEndpoint';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { heliusAssetToAssetCollectible } from '../../utils/solana/das/heliusAssetToAssetCollectible';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const dasUrl = getSolanaDasEndpoint();
  const connection = getClientSolana();

  const accounts = await getAutoParsedProgramAccounts<Order>(
    connection,
    famousTokenMarketIdlItem,
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

  const [heliusAssets, tokenPrices] = await Promise.all([
    getAssetBatchDasAsMap(
      dasUrl,
      accounts.map((acc) => acc.mint)
    ),
    cache.getTokenPricesAsMap(
      accounts.map((acc) => acc.mint),
      NetworkId.solana
    ),
  ]);

  const elements: PortfolioElement[] = [];
  const assets: PortfolioAsset[] = [];

  accounts.forEach((acc) => {
    const heliusAsset = heliusAssets.get(acc.mint);
    const tokenPrice = tokenPrices.get(acc.mint);
    if (!heliusAsset && !tokenPrice) return;

    if (tokenPrice) {
      // TOKEN
      assets.push({
        ...tokenPriceToAssetToken(
          tokenPrice.address,
          new BigNumber(acc.count).toNumber(),
          NetworkId.solana,
          tokenPrice
        ),
        attributes: {},
      });
    } else if (heliusAsset?.content.metadata) {
      // NFT
      const mintAsset = heliusAssetToAssetCollectible(heliusAsset);
      if (mintAsset) assets.push(mintAsset);
    }
  });

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
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
