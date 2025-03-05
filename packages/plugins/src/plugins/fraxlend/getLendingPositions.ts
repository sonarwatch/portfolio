import {
  EvmNetworkIdType,
  NetworkId,
  PortfolioElementBorrowLend,
  PortfolioElementBorrowLendData,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { getAddress } from '@ethersproject/address';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { pairAddressesCachePrefix, platformId } from './constants';
import { PoolTokenPairs } from './pairsJob';
import { getEvmClient } from '../../utils/clients';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { lendingAbi } from './abis';

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

  // Define the contract calls for each market
  const calls = contracts.map(
    (contract) =>
      ({
        address: contract.pairAddress as `0x${string}`,
        functionName: 'getUserSnapshot',
        abi: [lendingAbi.getUserSnapshot],
        args: [getAddress(owner)],
      } as const)
  );

  // Fetch user snapshots using Viewn multicall
  const userSnapshots = await client.multicall({
    contracts: calls,
  });

  // Define the LTV calls for each contract
  // const ltvCalls = contracts.map(
  //   (contract) =>
  //     ({
  //       address: contract.pairAddress as `0x${string}`,
  //       functionName: 'maxLTV',
  //       abi: [abi.maxLTV],
  //     } as const)
  // );

  // Fetch LTV values using Viewn multicall
  // const ltvResponses = await client.multicall({
  //   contracts: ltvCalls,
  // });

  // Define the total borrow calls for each contract
  const totalBorrowCalls = contracts.map(
    (contract) =>
      ({
        address: contract.pairAddress as `0x${string}`,
        functionName: 'totalBorrow',
        abi: [lendingAbi.totalBorrow],
      } as const)
  );

  // Fetch total borrow values using Viewn multicall
  const totalBorrowResponses = await client.multicall({
    contracts: totalBorrowCalls,
  });

  // Define the total asset calls for each contract
  const totalAssetCalls = contracts.map(
    (contract) =>
      ({
        address: contract.pairAddress as `0x${string}`,
        functionName: 'totalAsset',
        abi: [lendingAbi.totalAsset],
      } as const)
  );

  // Fetch total asset values using viem multicall
  const totalAssetResponses = await client.multicall({
    contracts: totalAssetCalls,
  });

  // Process the responses manually
  const balances = [];
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const snapshot = userSnapshots[i];
    // const ltv = ltvResponses[i];
    const borrow = totalBorrowResponses[i];
    const asset = totalAssetResponses[i];

    // Check if all responses are successful
    if (
      snapshot.status !== 'success' ||
      // ltv.status !== 'success' ||
      borrow.status !== 'success' ||
      asset.status !== 'success'
    ) {
      continue;
    }

    try {
      // Convert responses to string for BigNumber

      // Convert snapshot.result to the expected type
      const snapshotResult = snapshot.result as bigint[];
      // const ltvResult = ltv.result as bigint;
      const borrowResult = borrow.result as [bigint, bigint];
      const assetResult = asset.result as [bigint, bigint];

      // Convert responses to BigNumber
      const [userAssetShares, userBorrowShares, userCollateralBalance] =
        snapshotResult.map((value) => BigNumber(value.toString()));
      // const maxLtv = BigNumber(ltvResult.toString());
      const [amountBorrow, sharesBorrow] = borrowResult.map((value) =>
        BigNumber(value.toString())
      );
      const [amountAsset, sharesAsset] = assetResult.map((value) =>
        BigNumber(value.toString())
      );

      console.log(userAssetShares, userBorrowShares, userCollateralBalance);

      // Avoid division by zero
      if (sharesBorrow.isZero() || sharesAsset.isZero()) {
        continue;
      }

      // Calculate price per share
      const pricePerFullShareBorrow = amountBorrow.div(sharesBorrow);
      const pricePerFullShareAsset = amountAsset.div(sharesAsset);

      // Calculate user balances
      const userBorrow = userBorrowShares.times(pricePerFullShareBorrow);
      const userAsset = userAssetShares.times(pricePerFullShareAsset);

      if (
        userAsset.isZero &&
        userBorrow.isZero() &&
        userCollateralBalance.isZero()
      ) {
        continue;
      }

      console.log('hey');

      // Create balance object
      const balance = {
        contractAddress: contract.pairAddress,
        supplyAssetAddress: contract.suppliedAssetAddress,
        borrowAssetAddress: contract.borrowedAssetAddress,
        supplyAssetBalance: userAsset.toString(),
        borrowAssetBalance: userBorrow.toString(),
        collateralBalance: userCollateralBalance.toString(),
      };

      balances.push(balance);
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

    console.log({ positions });

    const elements: PortfolioElementBorrowLend[] = [];

    const promises = positions.map(async (position) => {
      /* 
        Most of these prices come from plugins/curve/poolTokenPricesJob.ts
      */
      const supplyTokenPricePromise = cache.getTokenPrice(
        position.supplyAssetAddress,
        NetworkId.fraxtal
      );
      const borrowTokenPricePromise = cache.getTokenPrice(
        position.borrowAssetAddress,
        NetworkId.fraxtal
      );

      const [supplyTokenPrice, borrowTokenPrice] = await Promise.all([
        supplyTokenPricePromise,
        borrowTokenPricePromise,
      ]);

      const supplyTokenBalance = new BigNumber(position.collateralBalance)
        .div(10 ** (supplyTokenPrice?.decimals ?? 18))
        .toNumber();

      const borrowTokenBalance = new BigNumber(position.borrowAssetBalance)
        .div(10 ** (borrowTokenPrice?.decimals ?? 18))
        .toNumber();

      const supplyAsset = tokenPriceToAssetToken(
        position.supplyAssetAddress,
        supplyTokenBalance,
        NetworkId.fraxtal,
        supplyTokenPrice
      );

      const borrowAsset = tokenPriceToAssetToken(
        position.borrowAssetAddress,
        borrowTokenBalance,
        NetworkId.fraxtal,
        borrowTokenPrice
      );

      let totalValue: number | null = null;

      if (supplyAsset?.value != null && borrowAsset?.value != null) {
        const supplyAssetValue = new BigNumber(supplyAsset.value);
        const borrowAssetValue = new BigNumber(borrowAsset.value);

        totalValue = supplyAssetValue.minus(borrowAssetValue).toNumber();
      }

      const elementData: PortfolioElementBorrowLendData = {
        borrowedAssets: borrowTokenBalance > 0 ? [borrowAsset] : [],
        borrowedValue: borrowTokenBalance > 0 ? borrowAsset.value : 0,
        healthRatio: 0,
        suppliedAssets: [supplyAsset],
        suppliedValue: supplyAsset.value,
        value: totalValue,
        // unused
        rewardAssets: [],
        rewardValue: 0,
        borrowedYields: [],
        suppliedYields: [],
      };

      const element: PortfolioElementBorrowLend = {
        type: PortfolioElementType.borrowlend,
        networkId,
        platformId,
        label: 'Lending',
        value: elementData.value,
        data: elementData,
      };

      elements.push(element);
    });

    await Promise.all(promises);

    return elements;
  };

  return {
    id: `${platformId}-${networkId}-lending`,
    networkId,
    executor,
  };
}

export default fetcher;
