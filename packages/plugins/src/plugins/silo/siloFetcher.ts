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
    await Promise.all(
      pools.map(async (pool, i) => {
        const collateralRes = collateralBalances[i];
        const debtRes = debtBalances[i];

        if (collateralRes.status !== 'success' || debtRes.status !== 'success')
          return;

        // Handle missing token prices by getting price from underlying asset
        const isMissingPrice = MISSING_TOKEN_PRICE_ADDRESSES.includes(
          pool.asset as Address
        );
        if (isMissingPrice && (!pool.underlyingAsset || !pool.conversionRate))
          return;

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

        if (collateral.isZero() && debt.isZero()) return;

        const tokenPrice = await cache.getTokenPrice(poolAsset!, networkId);
        if (!tokenPrice?.price) return;

        const element = elementRegistry.addElementBorrowlend({
          label: 'Lending',
        });
        if (!collateral.isZero()) {
          element.addSuppliedAsset({
            address: poolAsset!,
            amount: collateral.toString(),
          });
        }
        if (!debt.isZero()) {
          element.addBorrowedAsset({
            address: poolAsset!,
            amount: debt.toString(),
          });
        }
      })
    );

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${PLATFORM_ID}-${networkId}-positions`,
    networkId,
    executor,
  };
}

export default fetcher;
