import {
  NetworkId,
  yieldFromApy,
  parseTypeString,
  PortfolioElementLiquidity,
  ethereumNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';

import { getEvmClient } from '../../utils/clients';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { ObjectResponse } from '../../utils/sui/types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { vaultsKey } from '../elixir/constants';
import { PositionField } from '../elixir/types';
import { getAddress } from 'viem';
import { abi } from './abi';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ethFactor } from '../../utils/evm/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const strategies = await cache.getItem<`0x${string}`[]>(
    'eigenlayer-strategies',
    {
      prefix: platformId,
      networkId: NetworkId.ethereum,
    }
  );

  if (!strategies || strategies.length === 0) return [];

  const elements: PortfolioElementLiquidity[] = [];

  try {
    // Fetch both shares and underlying tokens in parallel
    const [sharesResult, underlyingTokensResult] = await Promise.all([
      client.multicall({
        contracts: strategies.map((strategy) => ({
          address: getAddress(strategy),
          abi: [abi.shares],
          functionName: abi.shares.name,
          args: [getAddress(owner)],
        })),
      }),
      client.multicall({
        contracts: strategies.map((strategy) => ({
          address: getAddress(strategy),
          abi: [abi.underlyingToken],
          functionName: abi.underlyingToken.name,
        })),
      }),
    ]);

    const positions = strategies.map((strategy, i) => ({
      strategyAddress: getAddress(strategy),
      underlyingToken: underlyingTokensResult[i].result,
      amount: sharesResult[i].result,
    }));

    // Filter out positions with zero amounts
    const activePositionsShares = positions.filter(
      (position) =>
        position.amount && position.amount > 0 && position.underlyingToken
    );

    const amounts = await client.multicall({
      contracts: activePositionsShares.map((position) => ({
        address: getAddress(position.strategyAddress),
        abi: [abi.sharesToUnderlying],
        functionName: abi.sharesToUnderlying.name,
        args: [position.amount],
      })),
    });

    // Get decimals of underlying token
    const decimals = await client.multicall({
      contracts: activePositionsShares.map((position) => ({
        address: getAddress(position.underlyingToken as `0x${string}`),
        abi: [abi.decimals],
        functionName: abi.decimals.name,
      })),
    });

    const finalPositions = activePositionsShares.map((position, i) => ({
      ...position,
      amount: amounts[i].result,
      decimals: decimals[i].result,
    }));

    const elementRegistry = new ElementRegistry(NetworkId.ethereum, platformId);

    for (const position of finalPositions) {
      const underlyingToken = position.underlyingToken;
      if (!underlyingToken || !position.amount) return;

      const amount = position.amount;
      const tokenPrice = await cache.getTokenPrice(
        underlyingToken,
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
      console.log(asset);
    }

    // ... continue processing elements ...
  } catch (error) {
    console.error('Error fetching EigenLayer positions:', error);
    return elements;
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
