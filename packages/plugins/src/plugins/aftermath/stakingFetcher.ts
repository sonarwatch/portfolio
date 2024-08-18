import {
  NetworkId,
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
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { StakingPosition } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const farmFactor = new BigNumber(10 ** 9);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const stakedPositions = await getOwnedObjects<StakingPosition>(
    client,
    owner,
    {
      filter: {
        StructType: stakingType,
      },
      options: {
        showContent: true,
      },
    }
  );
  if (stakedPositions.length === 0) return [];

  const burnerVaults = stakedPositions.map((object) => {
    if (object.data?.content?.fields.afterburner_vault_id)
      return object.data.content.fields.afterburner_vault_id;

    return '';
  });

  const burnerVaultsObjects = await multiGetObjects(client, burnerVaults);

  const burnerVaultsTypes = burnerVaultsObjects.map(
    (vault) => vault.data?.type
  );

  const lpMints = burnerVaultsTypes
    .map((type) => {
      if (!type) return undefined;

      const lp = parseTypeString(type).keys?.at(0)?.type;
      if (!lp || !lp.includes('af_lp')) return undefined;

      return formatTokenAddress(lp, NetworkId.sui);
    })
    .flat();

  const lpTokenPriceById = await cache.getTokenPricesAsMap(
    lpMints.map((lp) => (lp !== undefined ? lp : [])).flat(),
    NetworkId.sui
  );

  const liquidities: PortfolioLiquidity[] = [];
  for (let i = 0; i < stakedPositions.length; i++) {
    const object = stakedPositions[i];
    if (!object.data?.content) continue;

    const lp = lpMints[i];
    if (!lp) continue;

    const lpPrice = lpTokenPriceById.get(lp);
    if (!lpPrice) continue;

    const position = object.data.content.fields;

    const amount = new BigNumber(position.balance)
      .dividedBy(farmFactor)
      .toNumber();

    const assets = tokenPriceToAssetTokens(
      lpPrice.address,
      amount,
      NetworkId.sui,
      lpPrice
    );

    const value = getUsdValueSum(assets.map((asset) => asset.value));

    liquidities.push({
      assets,
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: null,
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
