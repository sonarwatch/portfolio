import { EvmNetworkIdType, PortfolioElement } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Address, ContractFunctionConfig, getAddress } from 'viem';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getEvmClient } from '../../utils/clients';
import {
  PLATFORM_ID,
  SILOS_POOLS_KEY,
  LEGACY_LENS_ADDRESS,
  MISSING_TOKEN_PRICE_ADDRESSES,
} from './constants';
import { balanceAbi } from './abis';
import { SiloPool } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { executeAndSplitMulticall } from '../../utils/octav/splitMulticallResult';

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (
    owner: string,
    cache: Cache
  ): Promise<PortfolioElement[]> => {
    const ownerAddress = getAddress(owner);
    const pools = await cache.getItem<SiloPool[]>(SILOS_POOLS_KEY, {
      prefix: PLATFORM_ID,
      networkId,
    });
    if (!pools) return [];

    const client = getEvmClient(networkId);
    const elementRegistry = new ElementRegistry(networkId, PLATFORM_ID);

    const poolCalls = pools.flatMap<ContractFunctionConfig<typeof balanceAbi>>(
      (pool) => [
        {
          address: LEGACY_LENS_ADDRESS,
          abi: balanceAbi,
          functionName: 'collateralBalanceOfUnderlying',
          args: [pool.vault, pool.asset as Address, ownerAddress],
        } as const,
        {
          address: LEGACY_LENS_ADDRESS,
          abi: balanceAbi,
          functionName: 'debtBalanceOfUnderlying',
          args: [pool.vault, pool.asset as Address, ownerAddress],
        } as const,
      ]
    );

    const [collateralBalances, debtBalances] = await executeAndSplitMulticall(
      client,
      poolCalls
    );

    // Process balances and create assets
    const assets = await Promise.all(
      pools.map(async (pool, i) => {
        const collateralRes = collateralBalances[i];
        const debtRes = debtBalances[i];

        if (collateralRes.status !== 'success' || debtRes.status !== 'success')
          return undefined;

        // Handle missing token prices by getting price from underlying asset
        const isMissingPrice = MISSING_TOKEN_PRICE_ADDRESSES.includes(
          pool.asset as Address
        );
        if (isMissingPrice && (!pool.underlyingAsset || !pool.conversionRate))
          return undefined;

        const poolAsset = isMissingPrice ? pool.underlyingAsset : pool.asset;
        // If we use the underlying asset, we need to convert the balance to the asset
        // It defaults to 1 if the amount doesn't need to be converted
        const conversionRate = isMissingPrice
          ? new BigNumber(pool.conversionRate!.toString())
          : BigNumber(1);

        const collateral = new BigNumber(
          collateralRes.result.toString()
        ).multipliedBy(conversionRate);

        const debt = new BigNumber(debtRes.result.toString()).multipliedBy(
          conversionRate
        );

        if (collateral.isZero() && debt.isZero()) return undefined;

        return {
          ...pool,
          collateralAmount: collateral,
          debtAmount: debt,
          asset: poolAsset,
        } as const;
      })
    );

    const validAssets = assets.filter(
      (asset): asset is NonNullable<typeof asset> => asset !== undefined
    );
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
    for (const vaultAssets of Object.values(vaultGroups)) {
      const element = elementRegistry.addElementBorrowlend({
        label: 'Lending',
      });

      // Handle both supplied and borrowed assets in a single loop
      for (const asset of vaultAssets) {
        if (!asset.collateralAmount.isZero()) {
          element.addSuppliedAsset({
            address: asset.asset!,
            amount: asset.collateralAmount,
          });
        }
        if (!asset.debtAmount.isZero()) {
          element.addBorrowedAsset({
            address: asset.asset!,
            amount: asset.debtAmount,
          });
        }
      }
    }

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${PLATFORM_ID}-${networkId}-positions`,
    networkId,
    executor,
  };
}

export default fetcher;
