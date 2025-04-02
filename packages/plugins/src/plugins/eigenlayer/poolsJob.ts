import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getEvmClient } from '../../utils/clients';

import { getEigenLayerOperators } from './helper';
import { abi } from './abi';
import { getAddress } from 'viem';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  // Get all EigenLayer operators
  const operators = await getEigenLayerOperators();

  // Get all the strategies addresses from the operators
  const strategies = Array.from(
    new Set<`0x${string}`>(
      operators.data
        .flatMap((operator) => operator.shares)
        .map((share) => share.strategyAddress)
    )
  );

  // Get the underlying token addresses from the strategies
  const underlyingTokensResult = await client.multicall({
    contracts: strategies.map((strategy) => ({
      address: getAddress(strategy),
      abi: [abi.underlyingToken],
      functionName: abi.underlyingToken.name,
    })),
  });

  // Map the underlying token with the strategy address
  const strategiesAndUnderlyingTokens = strategies.map((strategy, i) => ({
    strategyAddress: getAddress(strategy),
    underlyingToken: underlyingTokensResult[i].result,
  }));

  // Get decimals of underlying token
  const decimals = await client.multicall({
    contracts: strategiesAndUnderlyingTokens
      .filter((strategy) => strategy.underlyingToken)
      .map((strategy) => ({
        address: getAddress(strategy.underlyingToken as `0x${string}`),
        abi: [abi.decimals],
        functionName: abi.decimals.name,
      })),
  });

  // Construct the strategies and underlying tokens with decimals
  const strategiesAndUnderlyingTokensWithDecimals =
    strategiesAndUnderlyingTokens.map((strategy, i) => ({
      ...strategy,
      decimals: decimals[i]?.result,
    }));

  // Cache the strategies and underlying tokens with decimals
  await cache.setItem(
    'eigenlayer-strategies',
    strategiesAndUnderlyingTokensWithDecimals,
    {
      prefix: platformId,
      networkId: NetworkId.ethereum,
    }
  );
};

const job: Job = {
  id: `${platformId}-strategies`,
  executor,
  labels: ['normal'],
};

export default job;
