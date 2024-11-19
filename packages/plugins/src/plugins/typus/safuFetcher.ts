import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  safuVaultsKey,
  safuVaultsNames,
  vaultsIndexes,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { getShareData } from './safu_helpers';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { TypusBidReceipt, Vault } from './safu_types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const vaultsMemo = new MemoizedCache<{
  [p: string]: [Vault, TypusBidReceipt | null];
}>(safuVaultsKey, {
  prefix: platformId,
  networkId: NetworkId.sui,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const shareDatas = await getShareData(client, owner);

  let hasPosition = false;
  for (let i = 0; i < vaultsIndexes.length; i++) {
    const vaultIndex = vaultsIndexes[i];
    if (shareDatas[vaultIndex].length > 0) {
      hasPosition = true;
      break;
    }
  }
  if (!hasPosition) return [];

  const vaults = await vaultsMemo.getItem(cache);
  if (!vaults) return [];

  const tokenPrices = await cache.getTokenPricesAsMap(
    Object.values(vaults).map((v) => formatMoveTokenAddress(v[0].depositToken)),
    NetworkId.sui
  );

  const elements: PortfolioElement[] = [];

  for (let i = 0; i < vaultsIndexes.length; i++) {
    const vaultIndex = vaultsIndexes[i];
    const share = shareDatas[vaultIndex];
    if (share.length > 0) {
      const [vault] = vaults[vaultIndex];
      if (!vault) continue;

      const amount = new BigNumber(share[0].share.active_share)
        .plus(share[0].share.deactivating_share)
        .plus(share[0].share.inactive_share)
        .plus(share[0].share.warmup_share);

      if (amount.isZero()) continue;

      const tokenPrice = tokenPrices.get(
        formatMoveTokenAddress(vault.depositToken)
      );
      if (!tokenPrice) continue;

      const assets: PortfolioAsset[] = [];
      const rewardAssets: PortfolioAsset[] = [];

      assets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          amount.dividedBy(10 ** tokenPrice.decimals).toNumber(),
          NetworkId.sui,
          tokenPrice
        )
      );

      const assetsValue = getUsdValueSum(assets.map((a) => a.value));
      const rewardAssetsValue = getUsdValueSum(
        rewardAssets.map((a) => a.value)
      );
      const value = getUsdValueSum(
        [...assets, ...rewardAssets].map((a) => a.value)
      );

      const liquidities = [
        {
          assets,
          assetsValue,
          rewardAssets,
          rewardAssetsValue,
          value,
          yields: [],
        },
      ];

      elements.push({
        type: PortfolioElementType.liquidity,
        networkId: NetworkId.sui,
        platformId,
        label: 'Lending',
        name: `SAFU ${safuVaultsNames[vaultIndex] || ''}`,
        value: getUsdValueSum(liquidities.map((a) => a.value)),
        data: {
          liquidities,
        },
      });
    }
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-safu`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
