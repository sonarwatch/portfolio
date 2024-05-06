import {
  NetworkId,
  PortfolioLiquidity,
  UsdValue,
  formatMoveTokenAddress,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, vaultsInfo, vaultsInfoKey } from './constants';
import { getClientSui } from '../../utils/clients';
import { getMultipleBalances } from '../../utils/sui/mulitpleGetBalances';
import { Pool } from '../cetus/types';
import { clmmPoolsPrefix } from '../cetus/constants';
import { VaultPositionInfo } from './types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const vaultsBalances = await getMultipleBalances(
    client,
    owner,
    vaultsInfo.map((vault) => vault.tokenType)
  );

  if (!vaultsBalances.some((balance) => balance.totalBalance !== '0'))
    return [];

  const poolInfos = await cache.getItems<Pool>(
    vaultsInfo.map((vault) => vault.underlyingPool),
    { prefix: clmmPoolsPrefix, networkId: NetworkId.sui }
  );

  const vaultsPositionInfo = await cache.getItem<VaultPositionInfo[]>(
    vaultsInfoKey,
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
  if (!vaultsPositionInfo) return [];

  const tokenPriceById = await cache.getTokenPricesAsMap(
    poolInfos
      .map((pool) => (pool ? [pool.coinTypeA, pool.coinTypeB] : []))
      .flat(),
    NetworkId.sui
  );

  let totalValue: UsdValue = 0;
  const liquidities: PortfolioLiquidity[] = [];
  for (let i = 0; i < vaultsBalances.length; i++) {
    const balance = vaultsBalances[i];
    const pool = poolInfos[i];
    const vault = vaultsPositionInfo[i];
    if (!pool || !vault) continue;

    const totalSupply = new BigNumber(vault.totalSupply);

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(vault.liquidity),
      pool.current_tick_index,
      vault.lowerTick,
      vault.upperTick,
      false
    );

    const shares = new BigNumber(balance.totalBalance).dividedBy(totalSupply);

    const [tokenPriceA, tokenPriceB] = [
      tokenPriceById.get(formatMoveTokenAddress(pool.coinTypeA)),
      tokenPriceById.get(formatMoveTokenAddress(pool.coinTypeB)),
    ];
    if (!tokenPriceA || !tokenPriceB) continue;

    const amountA = tokenAmountA
      .times(shares)
      .dividedBy(10 ** tokenPriceA.decimals);
    const amountB = tokenAmountB
      .times(shares)
      .dividedBy(10 ** tokenPriceB.decimals);

    const assetA = tokenPriceToAssetToken(
      tokenPriceA.address,
      amountA.toNumber(),
      NetworkId.sui,
      tokenPriceA
    );

    const assetB = tokenPriceToAssetToken(
      tokenPriceB.address,
      amountB.toNumber(),
      NetworkId.sui,
      tokenPriceB
    );
    const value = getUsdValueSum([assetA.value, assetB.value]);

    totalValue = getUsdValueSum([totalValue, value]);
    liquidities.push({
      assets: [assetA, assetB],
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: null,
      value,
      yields: [],
    });
  }
  return [
    {
      type: 'liquidity',
      data: {
        liquidities,
      },
      label: 'LiquidityPool',
      networkId: NetworkId.sui,
      platformId,
      value: totalValue,
      name: 'Vaults',
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-vaults`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
