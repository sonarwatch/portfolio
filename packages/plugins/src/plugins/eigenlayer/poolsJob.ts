import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getEvmClient } from '../../utils/clients';

import {
  getAllStakers,
  getAVS,
  getContracts,
  getEigenLayerOperators,
  getEigenlayerStrategies,
  mapSuccessFilter,
} from './helper';
import { Share } from './types';
import { abi } from './abi';
import { getAddress } from 'viem';

const executor: JobExecutor = async (cache: Cache) => {
  const contracts = await getContracts(NetworkId.ethereum);
  const client = getEvmClient(NetworkId.ethereum);

  // Get all strategies deployed
  //const strategies = await getEigenlayerStrategies(NetworkId.ethereum);

  const operators = await getEigenLayerOperators();
  const strategies = Array.from(
    new Set<`0x${string}`>(
      operators.data
        .flatMap((operator) => operator.shares)
        .map((share) => share.strategyAddress)
    )
  );

  const underlyingTokensResult = await client.multicall({
    contracts: strategies.map((strategy) => ({
      address: getAddress(strategy),
      abi: [abi.underlyingToken],
      functionName: abi.underlyingToken.name,
    })),
  });

  const strategiesAndUnderlyingTokens = strategies.map((strategy, i) => ({
    strategyAddress: getAddress(strategy),
    underlyingToken: underlyingTokensResult[i].result,
  }));

  await cache.setItem('eigenlayer-strategies', strategiesAndUnderlyingTokens, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });

  //   await cache.setItem(
  //     vaultsTvlKey,
  //     Object.values(
  //       res.data.data.tvl_per_exchange.BLUEFIN.token_pairs
  //     ) as string[],
  //     {
  //       prefix: vaultsPrefix,
  //       networkId: NetworkId.sui,
  //     }
  //   );
};

const job: Job = {
  id: `${platformId}-strategies`,
  executor,
  labels: ['normal'],
};

export default job;
