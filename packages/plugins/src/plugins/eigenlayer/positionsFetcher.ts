import {
  NetworkId,
  yieldFromApy,
  parseTypeString,
  PortfolioElementLiquidity,
  ethereumNetwork,
  PortfolioElement,
  PortfolioElementType,
  PortfolioAsset,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { customEigenlayerTokenMapping, platformId } from './constants';

import { getEvmClient } from '../../utils/clients';

import { getAddress } from 'viem';
import { abi } from './abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

import { Position } from './types';

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  const client = getEvmClient(NetworkId.ethereum);

  const strategies = await cache.getItem<Position[]>('eigenlayer-strategies', {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });

  if (!strategies || strategies.length === 0) return [];

  try {
    // Fetch user shares on all strategies
    const [sharesResult] = await Promise.all([
      client.multicall({
        contracts: strategies.map((strategy) => ({
          address: getAddress(strategy.strategyAddress),
          abi: [abi.shares],
          functionName: abi.shares.name,
          args: [getAddress(owner)],
        })),
      }),
    ]);

    // Construct the strategies and underlying tokens with decimals
    const positions = strategies.map((strategy, i) => ({
      strategyAddress: getAddress(strategy.strategyAddress),
      underlyingToken: strategy.underlyingToken,
      shares: sharesResult[i].result,
      decimals: strategy.decimals,
    }));

    // Filter out positions with zero amounts
    const activePositionsShares = positions.filter(
      (position) =>
        position.shares && position.shares > 0 && position.underlyingToken
    );

    // Fetch the amount of underlying tokens from the shares
    const amounts = await client.multicall({
      contracts: activePositionsShares.map((position) => ({
        address: getAddress(position.strategyAddress),
        abi: [abi.sharesToUnderlying],
        functionName: abi.sharesToUnderlying.name,
        args: [position.shares],
      })),
    });

    const finalPositions = activePositionsShares.map((position, i) => ({
      ...position,
      amount: amounts[i].result,
    }));

    const assets: PortfolioAsset[] = [];
    let totalValue = 0;

    // Construct the assets
    for (const position of finalPositions) {
      const underlyingToken = position.underlyingToken;
      if (!underlyingToken || !position.amount) return [];

      const amount = position.amount;
      const tokenPrice = await cache.getTokenPrice(
        customEigenlayerTokenMapping[
          underlyingToken as keyof typeof customEigenlayerTokenMapping
        ] || underlyingToken,
        NetworkId.ethereum
      );
      const underlyingTokenAddress = getAddress(underlyingToken);
      const asset = tokenPriceToAssetToken(
        underlyingTokenAddress,
        BigNumber(amount.toString())
          .div(10 ** (position.decimals || 18))
          .toNumber(),
        NetworkId.ethereum,
        tokenPrice
      );
      assets.push(asset);
      totalValue = totalValue + (asset.value || 0);
    }

    const elements: PortfolioElement = {
      networkId: NetworkId.ethereum,
      platformId,
      // TODO: Change to Yield when Octav server is updated
      label: 'Deposit',
      type: PortfolioElementType.multiple,
      value: totalValue,
      data: {
        assets: assets,
      },
    };

    return [elements];
  } catch (error) {
    console.error('Error fetching EigenLayer positions:', error);
    return [];
  }
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
