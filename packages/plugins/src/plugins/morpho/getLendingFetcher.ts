import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { morphoMarketsCachePrefix, platformId } from './constants';
import { getEvmClient } from '../../utils/clients';
import { morphoContractABI } from './abis';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';
import { MorphoMarketRes } from './types';

const morphoContract = '0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb';

function getLendingFetcher(networkId: EvmNetworkIdType): Fetcher {
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

    /* 
       NOTE: We dont need the market data for pools that the user does not have any positions im, 
       wondering if its better fetch them async in a promise.all, or first get the positions 
       filter them and then fetch the needed markets in a second call.
    */
    const [userPositionsResponse, marketDataResponse] = await Promise.all([
      client.multicall({
        contracts: markets.map((market) => ({
          address: morphoContract,
          functionName: 'position',
          abi: morphoContractABI,
          args: [market.uniqueKey, owner],
        })),
      }),
      client.multicall({
        contracts: markets.map((market) => ({
          address: morphoContract,
          functionName: 'market',
          abi: morphoContractABI,
          args: [market.uniqueKey],
        })),
      }),
    ]);

    const elementRegistry = new ElementRegistry(networkId, platformId);
    for (let i = 0; i < markets.length; i++) {
      const partialMarket = markets[i];
      const userPosition = userPositionsResponse[i];
      const marketData = marketDataResponse[i];

      if (userPosition.error || marketData.error) {
        continue;
      }

      const [supplyShares, borrowShares, collateral] = userPosition.result as [
        bigint,
        bigint,
        bigint
      ];

      if (
        supplyShares === BigInt(0) &&
        borrowShares === BigInt(0) &&
        collateral === BigInt(0)
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
      ] = marketData.result as [bigint, bigint, bigint, bigint];

      // Using BigInt operations because bitwonka said this is where we are moving
      // would like a double check I did this correctly?
      const supplyAssets =
        totalSupplyShares === BigInt(0)
          ? BigInt(0)
          : (supplyShares * totalSupplyAssets) / totalSupplyShares;

      const borrowAssets =
        totalBorrowAssets === BigInt(0)
          ? BigInt(0)
          : (borrowShares * totalBorrowShares) / totalBorrowAssets;

      console.log(borrowAssets, supplyAssets, collateral);

      /* 
        Lending Position
        User has provided collateral to borrow 
      */
      const lendingElement = elementRegistry.addElementBorrowlend({
        label: 'Lending',
      });

      if (collateral !== BigInt(0)) {
        lendingElement.addSuppliedAsset({
          address: partialMarket.collateralAsset.address,
          amount: collateral.toString(),
        });
      }

      if (borrowAssets !== BigInt(0)) {
        lendingElement.addBorrowedAsset({
          address: partialMarket.loanAsset.address,
          amount: borrowAssets.toString(),
        });
      }

      /* 
        Deposit Positions
        User has provided an asset to be borrowed
      */
      const depositElement = elementRegistry.addElementMultiple({
        label: 'Deposit',
      });
      if (supplyAssets !== BigInt(0)) {
        depositElement.addAsset({
          address: partialMarket.loanAsset.address,
          amount: supplyAssets.toString(),
        });
      }
    }

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${platformId}-markets`,
    networkId: NetworkId.ethereum,
    executor,
  };
}

export default getLendingFetcher;
