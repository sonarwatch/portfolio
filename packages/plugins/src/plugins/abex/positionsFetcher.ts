import {
  NetworkId,
  PortfolioElementLiquidity,
  getUsdValueSum,
  suiNativeAddress,
  suiNativeDecimals,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  alpDecimals,
  alpType,
  platformId,
  poolAccRewardPerShareKey,
} from './constants';
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

  const [alpPrice, suiPrice] = await cache.getTokenPrices(
    [alpType, suiNativeAddress],
    NetworkId.sui
  );
  const poolAccRewardPerShareStr = await cache.getItem<string>(
    poolAccRewardPerShareKey,
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
  const poolAccRewardPerShare = poolAccRewardPerShareStr
    ? new BigNumber(poolAccRewardPerShareStr)
    : undefined;

  let alpAmount = new BigNumber(0);
  let claimmableAmount = new BigNumber(0);
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const cAlpAmount = object.data?.content?.fields.stake;
    if (!cAlpAmount) continue;
    alpAmount = alpAmount.plus(cAlpAmount);

    if (!poolAccRewardPerShare) continue;
    const accRewardPerShare = object.data?.content?.fields.acc_reward_per_share;
    if (!accRewardPerShare) continue;

    const cClaimmableAmount = poolAccRewardPerShare
      .minus(accRewardPerShare)
      .times(cAlpAmount)
      .div(10 ** 18);
    claimmableAmount = claimmableAmount.plus(cClaimmableAmount);
  }
  const asset = tokenPriceToAssetToken(
    alpType,
    alpAmount.dividedBy(10 ** alpDecimals).toNumber(),
    NetworkId.sui,
    alpPrice
  );
  const rewardAsset = tokenPriceToAssetToken(
    suiNativeAddress,
    claimmableAmount.dividedBy(10 ** suiNativeDecimals).toNumber(),
    NetworkId.sui,
    suiPrice
  );

  if (claimmableAmount.isZero() && alpAmount.isZero()) return [];
  const value = getUsdValueSum([rewardAsset.value, asset.value]);
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
          rewardAssets: [rewardAsset],
          rewardAssetsValue: rewardAsset.value,
          value,
          yields: [],
        },
      ],
    },
    value,
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
