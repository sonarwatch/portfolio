import { ContractFunctionConfig, getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';

import { getEvmClient } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';
import { zeroBigInt } from '../../utils/misc/constants';
import {
  MorphoNetworkIdType,
  morphoMarketsCachePrefix,
  networkIdToMorphoContract,
  platformId,
} from './constants';
import { MorphoMarketRes } from './types';
import { morphoContractABI } from './abis';

export function getLendingFetcher(networkId: MorphoNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const markets = await cache.getItem<MorphoMarketRes['markets']['items']>(
      morphoMarketsCachePrefix,
      {
        networkId,
        prefix: morphoMarketsCachePrefix,
      }
    );
    if (!markets || markets.length === 0) {
      return [];
    }

    const client = getEvmClient(networkId);
    const multicallResponse = await client.multicall({
      contracts: markets.flatMap<
        ContractFunctionConfig<typeof morphoContractABI>
      >((market) => [
        {
          address: getAddress(networkIdToMorphoContract[networkId]),
          functionName: 'position',
          abi: morphoContractABI,
          args: [market.uniqueKey, getAddress(owner)],
        },
        {
          address: getAddress(networkIdToMorphoContract[networkId]),
          functionName: 'market',
          abi: morphoContractABI,
          args: [market.uniqueKey],
        },
      ]),
    });

    const elementRegistry = new ElementRegistry(networkId, platformId);
    for (let i = 0; i < markets.length; i++) {
      const partialMarket = markets[i];
      const userPosition = multicallResponse[i * 2];
      const marketData = multicallResponse[i * 2 + 1];

      if (userPosition.error || marketData.error) {
        continue;
      }

      const [supplyShares, borrowShares, collateral] = userPosition.result;

      if (
        supplyShares === zeroBigInt &&
        borrowShares === zeroBigInt &&
        collateral === zeroBigInt
      ) {
        continue;
      }

      const [
        totalSupplyAssets,
        totalSupplyShares,
        totalBorrowAssets,
        totalBorrowShares,
        // lastUpdate,
        // fee,
      ] = marketData.result;

      const supplyAssets =
        totalSupplyShares === zeroBigInt
          ? zeroBigInt
          : (supplyShares * totalSupplyAssets) / totalSupplyShares;

      const borrowAssets =
        !totalBorrowShares || totalBorrowShares === zeroBigInt
          ? zeroBigInt
          : (borrowShares * totalBorrowAssets) / totalBorrowShares;

      /* 
        Lending Position
        User has provided collateral to borrow 
      */
      const lendingElement = elementRegistry.addElementBorrowlend({
        label: 'Lending',
      });

      lendingElement.addSuppliedAsset({
        address: partialMarket.collateralAsset.address,
        amount: collateral.toString(),
      });

      lendingElement.addBorrowedAsset({
        address: partialMarket.loanAsset.address,
        amount: borrowAssets.toString(),
      });

      /* 
        Deposit Positions
        User has provided an asset to be borrowed
      */
      const depositElement = elementRegistry.addElementMultiple({
        label: 'Deposit',
      });
      depositElement.addAsset({
        address: partialMarket.loanAsset.address,
        amount: supplyAssets.toString(),
      });
    }

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${platformId}-${networkId}-markets`,
    networkId,
    executor,
  };
}
