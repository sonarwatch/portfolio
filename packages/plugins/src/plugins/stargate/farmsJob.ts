import { zeroAddress } from 'viem';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { poolInfoAbi, poolLengthAbi } from './abis';
import { farmsKey, platformId, stargateNetworksConfigs } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  for (const info of stargateNetworksConfigs) {
    const { farmsContract: address, networkId } = info;
    const client = getEvmClient(networkId);
    const contract = {
      address,
      abi: poolLengthAbi,
      functionName: 'poolLength',
    } as const;
    const poolsLength = await client.readContract(contract);
    const contracts = [];
    for (let i = BigInt(0); i < Number(poolsLength); i++) {
      contracts.push({
        address,
        abi: poolInfoAbi,
        functionName: 'poolInfo',
        args: [i],
      } as const);
    }
    const results = await client.multicall({ contracts });
    const farms = results.map((res) =>
      res.status === 'failure' ? zeroAddress : res.result[0]
    );

    await cache.setItem(farmsKey, farms, {
      prefix: platformId,
      networkId,
    });
  }
};

const job: Job = {
  id: `${platformId}-farms`,
  executor,
};
export default job;
