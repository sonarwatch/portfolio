import { NetworkId } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import {
  morphoAaveV3Address,
  platformId,
  updatedIndexesPrefix,
  wethAddress,
} from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { MorphoAaveV3Abi } from './utils/abis';
import { parseUpdatedIndexes } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const wEthUpdatedIndexes = await client.readContract({
    abi: MorphoAaveV3Abi,
    functionName: 'updatedIndexes',
    args: [getAddress(wethAddress)],
    address: getAddress(morphoAaveV3Address),
  });
  await cache.setItem(wethAddress, parseUpdatedIndexes(wEthUpdatedIndexes), {
    networkId: NetworkId.ethereum,
    prefix: updatedIndexesPrefix,
  });
};

const job: Job = {
  id: `${platformId}-aave-v3`,
  networkIds: [NetworkId.ethereum],
  executor,
  labels: ['normal', 'evm', NetworkId.ethereum],
};
export default job;
