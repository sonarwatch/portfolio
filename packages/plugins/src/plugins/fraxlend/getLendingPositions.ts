import { getAddress } from '@ethersproject/address';
import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { pairAddressesCachePrefix, platformId } from './constants';
import { PoolTokenPairs } from './pairsJob';
import { getEvmClient } from '../../utils/clients';
import { Cache } from '../../Cache';
import { lendingAbi } from './abis';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

export type LendBorrowBalance = {
  userAsset: string;
  userBorrow: string;
  userCollateral: string;
  ltv: string;
};

export async function getLendBorrowBalances(
  networkId: EvmNetworkIdType,
  owner: string,
  contracts: PoolTokenPairs[]
) {
  const client = getEvmClient(networkId);

  const [userSnapshots, totalBorrowResponses, totalAssetResponses] =
    await Promise.all([
      client.multicall({
        contracts: contracts.map(
          (contract) =>
            ({
              address: contract.pairAddress as `0x${string}`,
              functionName: 'getUserSnapshot',
              abi: [lendingAbi.getUserSnapshot],
              args: [getAddress(owner)],
            } as const)
        ),
      }),
      client.multicall({
        contracts: contracts.map(
          (contract) =>
            ({
              address: contract.pairAddress as `0x${string}`,
              functionName: 'totalBorrow',
              abi: [lendingAbi.totalBorrow],
            } as const)
        ),
      }),
      client.multicall({
        contracts: contracts.map(
          (contract) =>
            ({
              address: contract.pairAddress as `0x${string}`,
              functionName: 'totalAsset',
              abi: [lendingAbi.totalAsset],
            } as const)
        ),
      }),
    ]);

  const balances = [];
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const snapshot = userSnapshots[i];
    const borrow = totalBorrowResponses[i];
    const asset = totalAssetResponses[i];

    if (
      snapshot.status !== 'success' ||
      borrow.status !== 'success' ||
      asset.status !== 'success'
    ) {
      continue;
    }

    try {
      const snapshotResult = snapshot.result as bigint[];
      const borrowResult = borrow.result as [bigint, bigint];
      const assetResult = asset.result as [bigint, bigint];

      const [userAssetShares, userBorrowShares, userCollateralBalance] =
        snapshotResult.map((value) => BigNumber(value.toString()));
      const [amountBorrow, sharesBorrow] = borrowResult.map((value) =>
        BigNumber(value.toString())
      );
      const [amountAsset, sharesAsset] = assetResult.map((value) =>
        BigNumber(value.toString())
      );

      const pricePerFullShareBorrow = amountBorrow.div(sharesBorrow);
      const pricePerFullShareAsset = amountAsset.div(sharesAsset);

      const userBorrow = userBorrowShares.times(pricePerFullShareBorrow);
      const userAsset = userAssetShares.times(pricePerFullShareAsset);

      if (
        userAsset.isZero() &&
        userBorrow.isZero() &&
        userCollateralBalance.isZero()
      ) {
        continue;
      }

      balances.push({
        contractAddress: contract.pairAddress,
        supplyAssetAddress: contract.suppliedAssetAddress,
        borrowAssetAddress: contract.borrowedAssetAddress,
        supplyAssetBalance: userAsset.toString(),
        collateralBalance: userCollateralBalance.toString(),
        borrowAssetBalance: userBorrow.toString(),
      });
    } catch (error) {
      console.error(
        `Error processing contract ${contract.pairAddress}:`,
        error
      );
    }
  }

  return balances;
}

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const contracts = await cache.getItem<PoolTokenPairs[]>(
      pairAddressesCachePrefix,
      {
        networkId,
        prefix: pairAddressesCachePrefix,
      }
    );

    if (!contracts) {
      return [];
    }

    const positions = await getLendBorrowBalances(networkId, owner, contracts);
    const elementRegistry = new ElementRegistry(networkId, platformId);

    positions.forEach((position) => {
      const element = elementRegistry.addElementBorrowlend({
        label: 'Lending',
      });

      if (position.supplyAssetBalance !== '0') {
        element.addSuppliedAsset({
          address: position.borrowAssetAddress,
          amount: position.supplyAssetBalance,
        });
      }

      if (position.collateralBalance !== '0') {
        element.addSuppliedAsset({
          address: position.supplyAssetAddress,
          amount: position.collateralBalance,
        });
      }

      if (position.borrowAssetBalance !== '0') {
        element.addBorrowedAsset({
          address: position.borrowAssetAddress,
          amount: position.borrowAssetBalance,
        });
      }
    });

    return elementRegistry.getElements(cache);
  };

  return {
    id: `${platformId}-${networkId}-lending`,
    networkId,
    executor,
  };
}

export default fetcher;
