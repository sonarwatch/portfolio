import {
  NetworkId,
  PortfolioElementLiquidity,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { alpDecimals, alpType, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { Credential } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const objects = await getOwnedObjects<Credential>(client, owner, {
    filter: {
      Package:
        '0xc985ff436f334f864d74f35c3da9e116419b63a0c027cbe2ac7815afc4abc450',
    },
  });
  if (objects.length === 0) return [];
  const alpPrice = await cache.getTokenPrice(alpType, NetworkId.sui);
  let alpAmount = new BigNumber(0);
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    alpAmount = alpAmount.plus(object.data?.content?.fields.stake || 0);
  }
  const asset = tokenPriceToAssetToken(
    alpType,
    alpAmount.dividedBy(10 ** alpDecimals).toNumber(),
    NetworkId.sui,
    alpPrice
  );

  const element: PortfolioElementLiquidity = {
    networkId: NetworkId.sui,
    label: 'Staked',
    platformId,
    type: 'liquidity',
    data: {
      liquidities: [
        {
          assets: [asset],
          assetsValue: asset.value,
          rewardAssets: [],
          rewardAssetsValue: 0,
          value: asset.value,
          yields: [],
        },
      ],
    },
    value: asset.value,
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
