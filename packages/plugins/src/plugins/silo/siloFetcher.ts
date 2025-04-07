import { EvmNetworkIdType, PortfolioElement } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { ContractFunctionConfig } from 'viem';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import {
  platformId,
  siloPoolsKey,
  legacyLensAddress,
  supplyTag,
  borrowTag,
  missingTokenPriceAddresses,
} from './constants';
import { balanceAbi } from './abis';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { SiloPool } from './types';
import { getAmount } from '../../utils/octav/tokenFactor';

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (
    owner: string,
    cache: Cache
  ): Promise<PortfolioElement[]> => {
    const pools = await cache.getItem<SiloPool[]>(siloPoolsKey, {
      prefix: platformId,
      networkId,
    });
    if (!pools) return [];

    const client = getEvmClient(networkId);

    const poolCalls = pools.flatMap<ContractFunctionConfig<typeof balanceAbi>>(
      (pool) => [
        {
          address: legacyLensAddress,
          abi: balanceAbi,
          functionName: 'collateralBalanceOfUnderlying',
          args: [
            pool.vault as `0x${string}`,
            pool.asset as `0x${string}`,
            owner as `0x${string}`,
          ],
        } as const,
        {
          address: legacyLensAddress,
          abi: balanceAbi,
          functionName: 'debtBalanceOfUnderlying',
          args: [
            pool.vault as `0x${string}`,
            pool.asset as `0x${string}`,
            owner as `0x${string}`,
          ],
        } as const,
      ]
    );

    const collateralBalancesAndDebtBalances = await client.multicall({
      contracts: poolCalls,
    });

    const collateralBalances = collateralBalancesAndDebtBalances.filter(
      (_, i) => i % 2 === 0
    );
    const debtBalances = collateralBalancesAndDebtBalances.filter(
      (_, i) => i % 2 === 1
    );

    // Process balances and create assets
    const assets = await Promise.all(
      pools.map(async (pool, i) => {
        if (i >= pools.length - 1) return null;
        const collateralRes = collateralBalances[i];
        const debtRes = debtBalances[i];

        if (collateralRes.status !== 'success' || debtRes.status !== 'success')
          return null;

        // Handle missing token prices by getting price from underlying asset
        const isMissingPrice = missingTokenPriceAddresses.includes(
          pool.asset as `0x${string}`
        );
        if (isMissingPrice && (!pool.underlyingAsset || !pool.conversionRate))
          return null;

        const poolAsset = isMissingPrice ? pool.underlyingAsset : pool.asset;
        const conversionRate = isMissingPrice
          ? new BigNumber(pool.conversionRate!.toString())
          : BigNumber(1);

        const collateral = new BigNumber(
          collateralRes.result.toString()
        ).multipliedBy(conversionRate);

        const debt = new BigNumber(debtRes.result.toString()).multipliedBy(
          conversionRate
        );

        if (collateral.isZero() && debt.isZero()) return null;

        const tokenPrice = await cache.getTokenPrice(poolAsset!, networkId);
        if (!tokenPrice?.price) return null;

        return {
          ...pool,
          collateralAmount: getAmount(collateral, tokenPrice),
          debtAmount: getAmount(debt, tokenPrice),
          asset: tokenPriceToAssetToken(
            pool.asset,
            getAmount(collateral.isZero() ? debt : collateral, tokenPrice),
            networkId,
            tokenPrice,
            tokenPrice?.price || 0,
            { tags: [collateral.isZero() ? borrowTag : supplyTag] }
          ),
        };
      })
    );

    const validAssets = assets.filter((asset) => !!asset);
    if (validAssets.length === 0) return [];

    // Group by vault
    const vaultGroups = validAssets.reduce((acc, asset) => {
      if (!acc[asset.vault]) {
        acc[asset.vault] = [];
      }
      acc[asset.vault].push(asset);
      return acc;
    }, {} as { [vault: string]: typeof validAssets });

    // Create portfolio elements for each vault
    return Object.entries(vaultGroups).map(([, vaultAssets]) => ({
      type: 'multiple',
      label: 'Lending',
      networkId,
      platformId,
      value: vaultAssets.reduce((sum, asset) => {
        if (!asset.asset?.value) return sum;
        const isSupply = asset.asset.attributes?.tags?.includes(supplyTag);
        const isBorrow = asset.asset.attributes?.tags?.includes(borrowTag);
        if (isSupply) return sum + asset.asset.value;
        if (isBorrow) return sum - asset.asset.value;
        return sum;
      }, 0),
      data: {
        assets: vaultAssets.map((asset) => asset.asset).filter((a) => a),
      },
    }));
  };

  return {
    id: `${platformId}-${networkId}-positions`,
    networkId,
    executor,
  };
}

export default fetcher;
