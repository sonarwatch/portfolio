import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { CSMAbi } from './abis';
import { nftCSMAddress, lidoCSMOperatorsKey } from './constants';

type NodeOperator = {
  managerAddress: string;
  rewardAddress: string;
};

export default function getCSMJob(platformId: string): Job {
  const client = getEvmClient(NetworkId.ethereum);

  const executor: JobExecutor = async (cache: Cache) => {
    // Get total number of operators
    const operatorsCountRes = await client.readContract({
      abi: CSMAbi,
      address: nftCSMAddress as `0x${string}`,
      functionName: 'getNodeOperatorsCount',
    });

    if (!operatorsCountRes) return;
    const operatorsCount = Number(operatorsCountRes);

    // Create array of indices from 0 to operatorsCount-1
    const operatorIndices = Array.from(Array(operatorsCount).keys());

    // Get all operators details using multicall
    const operatorsRes = await client.multicall({
      contracts: operatorIndices.map(
        (index) =>
          ({
            abi: CSMAbi,
            address: nftCSMAddress as `0x${string}`,
            functionName: 'getNodeOperator',
            args: [BigInt(index)],
          } as const)
      ),
    });

    // Create mapping between addresses and IDs
    const operatorsMapping: { [address: string]: number } = {};

    operatorsRes.forEach((operator, index) => {
      if (operator.status === 'success') {
        const result = operator.result as NodeOperator;
        const managerAddress = result.managerAddress.toLowerCase();
        const rewardAddress = result.rewardAddress.toLowerCase();

        // Map both manager and reward addresses to the operator ID
        operatorsMapping[managerAddress] = index;
        operatorsMapping[rewardAddress] = index;
      }
    });

    // Store the mapping in cache
    await cache.setItem(lidoCSMOperatorsKey, operatorsMapping, {
      prefix: platformId,
      networkId: NetworkId.ethereum,
    });
  };

  return {
    id: `${platformId}-csm-operators`,
    executor,
    labels: ['normal'],
  };
}
