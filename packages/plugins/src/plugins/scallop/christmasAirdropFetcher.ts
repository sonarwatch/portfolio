import { NetworkId, PortfolioElementType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  christmasTableId,
  scaAddress,
  marketKey,
  marketPrefix,
  sscaAddress,
} from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientSui } from '../../utils/clients';
import type { ChristmasReward, MarketJobResult } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const [marketData, userRewardObject] = await Promise.all([
    cache.getItem<MarketJobResult>(marketKey, {
      prefix: marketPrefix,
      networkId: NetworkId.sui,
    }),
    client.getDynamicFieldObject({
      parentId: christmasTableId,
      name: {
        type: 'address',
        value: owner,
      },
    }),
  ]);

  if (
    !marketData ||
    userRewardObject?.data?.content?.dataType !== 'moveObject' ||
    !(userRewardObject?.data?.content?.fields as ChristmasReward).value
  )
    return [];

  const rewardValue = (userRewardObject.data.content.fields as ChristmasReward)
    .value;
  const scaAmount = BigNumber(rewardValue).shiftedBy(-9).toNumber();
  const scaMarket = Object.values(marketData).find(
    (market) => market.coinType === scaAddress
  );

  const sscaTokenPrice = await cache.getTokenPrice(sscaAddress, NetworkId.sui);
  const sscaAmount = scaAmount / (scaMarket?.conversionRate ?? 1);

  const sscaAsset = tokenPriceToAssetToken(
    sscaAddress,
    sscaAmount,
    NetworkId.sui,
    sscaTokenPrice,
    undefined,
    {
      isClaimable: true,
    }
  );

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Airdrop',
      name: 'Christmas',
      networkId: NetworkId.sui,
      platformId,
      data: {
        assets: [sscaAsset],
      },
      value: sscaAsset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-christmas-airdrop`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
