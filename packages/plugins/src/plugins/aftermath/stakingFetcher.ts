import {
  NetworkId,
  PortfolioAsset,
  PortfolioLiquidity,
  formatTokenAddress,
  getUsdValueSum,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakingType } from './constants';
import { getClientSui } from '../../utils/clients';
import { BurnerVault, StakingPosition } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { getHarvestRewards } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const farmFactor = new BigNumber(10 ** 9);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const stakedPositions = await getOwnedObjectsPreloaded<StakingPosition>(
    client,
    owner,
    {
      filter: {
        StructType: stakingType,
      },
    }
  );
  if (stakedPositions.length === 0) return [];

  const burnerVaults = stakedPositions.map((object) => {
    if (object.data?.content?.fields.afterburner_vault_id)
      return object.data.content.fields.afterburner_vault_id;

    return '';
  });

  const burnerVaultsObjects = await multiGetObjects<BurnerVault>(
    client,
    burnerVaults
  );

  const burnerVaultsTypes = burnerVaultsObjects.map(
    (vault) => vault.data?.type
  );

  const tokenAddresses: string[] = [];

  const lpMints = burnerVaultsTypes
    .map((type) => {
      if (!type) return undefined;

      const lp = parseTypeString(type).keys?.at(0)?.type;
      if (!lp || !lp.includes('af_lp')) return undefined;

      tokenAddresses.push(formatTokenAddress(lp, NetworkId.sui));

      return lp;
    })
    .flat();

  burnerVaultsObjects.forEach((vault) => {
    vault.data?.content?.fields.type_names.forEach((ct) =>
      tokenAddresses.push(ct)
    );
  });

  const [tokenPriceById, rewards] = await Promise.all([
    cache.getTokenPricesAsMap(tokenAddresses, NetworkId.sui),
    Promise.all(
      stakedPositions.map((object, i) => {
        const lp = lpMints[i];
        const burnerVault = burnerVaultsObjects.find(
          (bv) => bv.data?.content?.fields.id.id
        );
        if (!lp) return null;
        if (!object.data?.content) return null;
        if (!burnerVault || !burnerVault.data?.content?.fields) return null;
        return getHarvestRewards(
          client,
          owner,
          object.data.content.fields,
          lp,
          burnerVault.data?.content?.fields
        );
      })
    ),
  ]);

  if (!tokenPriceById) return [];

  const liquidities: PortfolioLiquidity[] = [];
  for (let i = 0; i < stakedPositions.length; i++) {
    const object = stakedPositions[i];
    if (!object.data?.content) continue;

    const lp = lpMints[i];
    if (!lp) continue;

    const lpTokenPrice = tokenPriceById.get(
      formatTokenAddress(lp, NetworkId.sui)
    );
    if (!lpTokenPrice) continue;

    const position = object.data.content.fields;

    const amount = new BigNumber(position.balance)
      .dividedBy(farmFactor)
      .toNumber();

    const assets = tokenPriceToAssetTokens(
      lpTokenPrice.address,
      amount,
      NetworkId.sui,
      lpTokenPrice
    );

    const rewardAssets: PortfolioAsset[] = [];

    const rewardsForPosition = rewards[i];
    if (rewardsForPosition) {
      rewardsForPosition.forEach((rewardAmount, coinType) => {
        const tokenPrice = tokenPriceById.get(
          formatTokenAddress(coinType, NetworkId.sui)
        );

        if (tokenPrice)
          rewardAssets.push(
            tokenPriceToAssetToken(
              formatTokenAddress(coinType, NetworkId.sui),
              rewardAmount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
              NetworkId.sui,
              tokenPrice
            )
          );
      });
    }

    const value = getUsdValueSum(
      [...assets, ...rewardAssets].map((asset) => asset.value)
    );

    liquidities.push({
      assets,
      assetsValue: getUsdValueSum(assets.map((asset) => asset.value)),
      rewardAssets,
      rewardAssetsValue: getUsdValueSum(
        rewardAssets.map((asset) => asset.value)
      ),
      value,
      yields: [],
    });
  }

  if (liquidities.length === 0) return [];

  return [
    {
      type: 'liquidity',
      data: { liquidities },
      label: 'Farming',
      networkId: NetworkId.sui,
      platformId,
      value: getUsdValueSum(liquidities.map((liq) => liq.value)),
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
