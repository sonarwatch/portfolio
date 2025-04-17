import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { bptInfoKey, platformId, poolAddresses } from './constants';
import { getPoolTokensAbi, totalSupplyAbi } from './abis';
import { PoolInfo } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const totalSupplyContract = {
    address: poolAddresses.token,
    abi: totalSupplyAbi,
    functionName: totalSupplyAbi[0].name,
  } as const;

  const getPoolContract = {
    address: poolAddresses.vault,
    abi: getPoolTokensAbi,
    functionName: getPoolTokensAbi[0].name,
    args: [poolAddresses.poolId],
  } as const;

  const [totalSupply, poolTokens] = await Promise.all([
    client.readContract(totalSupplyContract),
    client.readContract(getPoolContract),
  ]);

  const poolInfo: PoolInfo = {
    totalSupply: totalSupply.toString(),
    balances: poolTokens[1].map((balance) => balance.toString()),
  };

  await cache.setItem(bptInfoKey, poolInfo, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });
};

const job: Job = {
  id: `${platformId}-bpt-info`,
  networkIds: [NetworkId.ethereum],
  executor,
  labels: ['normal', 'evm', NetworkId.ethereum],
};
export default job;
