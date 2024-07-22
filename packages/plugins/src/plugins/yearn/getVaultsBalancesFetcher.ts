import {
  EvmNetworkIdType,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  Yield,
  apyToApr,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { vaultsKey } from './constants';
import { getBalancesYearn } from './helpers';
import { VaultData } from './types';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

export default function getVaultsBalancesFetcher(
  networkId: EvmNetworkIdType,
  platformId: string
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const vaults = await cache.getItem<VaultData[]>(vaultsKey, {
      prefix: platformId,
      networkId,
    });
    if (!vaults) return [];

    const balances = await getBalancesYearn(
      networkId,
      vaults.map((v) => v.address),
      owner
    );
    if (balances.length === 0) return [];

    const tokenAddresses = vaults
      .map((v) => (v.endorsed ? v.token.address : []))
      .flat();
    const tokensPrices = await cache.getTokenPrices(tokenAddresses, networkId);
    const tokenPriceById: Map<string, TokenPrice> = new Map();
    tokensPrices.forEach((tP) =>
      tP ? tokenPriceById.set(tP.address, tP) : []
    );

    const liquiditiesByVersion: Record<string, PortfolioLiquidity[]> = {};
    for (let index = 0; index < balances.length; index++) {
      const balance = balances[index];
      if (balance > BigInt(0)) {
        const vaultData = vaults[index];
        const amount = new BigNumber(balance.toString())
          .dividedBy(new BigNumber(10).pow(vaultData.decimals))
          .toNumber();
        const tokenPrice = tokenPriceById.get(vaultData.token.address);
        if (!tokenPrice) continue;

        const asset = tokenPriceToAssetToken(
          vaultData.token.address,
          amount,
          networkId,
          tokenPrice
        );
        const yields: Yield[] = [
          {
            apr: apyToApr(Number(vaultData.apy.net_apy)),
            apy: Number(vaultData.apy.net_apy),
          },
        ];
        const liquidity = {
          assets: [asset],
          assetsValue: asset.value,
          rewardAssets: [],
          rewardAssetsValue: null,
          value: asset.value,
          yields,
        };
        if (liquiditiesByVersion[vaultData.type]) {
          liquiditiesByVersion[vaultData.type].push(liquidity);
        } else {
          liquiditiesByVersion[vaultData.type] = [liquidity];
        }
      }
    }
    const elements: PortfolioElement[] = [];
    for (const [name, liquidities] of Object.entries(liquiditiesByVersion)) {
      if (liquidities.length > 0)
        elements.push({
          type: PortfolioElementType.liquidity,
          label: 'Farming',
          networkId,
          platformId,
          value: getUsdValueSum(liquidities.map((l) => l.value)),
          name: name.toUpperCase(),
          data: {
            liquidities,
          },
        });
    }

    return elements;
  };

  return {
    networkId,
    executor,
    id: `${platformId}-${networkId}-vaults`,
  };
}
