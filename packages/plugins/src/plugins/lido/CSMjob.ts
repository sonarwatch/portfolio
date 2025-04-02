import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { CSMAbi } from './abis';
import {
  nftCSMAddress,
  lidoCSMOperatorsKey,
  platformId,
  networkId,
} from './constants';

type NodeOperator = {
  readonly managerAddress: string;
  readonly rewardAddress: string;
};

export default function getCSMJob(): Job {
  const client = getEvmClient(networkId);

  const executor: JobExecutor = async (cache: Cache) => {
    // Get total number of operators
    const operatorsCountRes = await client.readContract({
      abi: CSMAbi,
      address: nftCSMAddress,
      functionName: 'getNodeOperatorsCount',
    });

    if (!operatorsCountRes) return;
    const operatorsCount = Number(operatorsCountRes);

    // Create array of indices from 0 to operatorsCount-1
    const operatorIndices = Array.from({ length: operatorsCount }, (_, i) => i);

    // Get all operators details using multicall
    const operatorsRes = await client.multicall({
      contracts: operatorIndices.map(
        (index) =>
          ({
            abi: CSMAbi,
            address: nftCSMAddress,
            functionName: 'getNodeOperator',
            args: [BigInt(index)],
          } as const)
      ),
    });

    // Create mapping between addresses and IDs
    const operatorsMapping: { [address: string]: number } = {};

    operatorsRes.forEach((operator, index) => {
      if (operator.status === 'success') {
        const { managerAddress, rewardAddress } =
          operator.result as NodeOperator;

        // Map both manager and reward addresses to the operator ID
        operatorsMapping[managerAddress] = index;
        operatorsMapping[rewardAddress] = index;
      }
    });

    // Store the mapping in cache
    await cache.setItem(lidoCSMOperatorsKey, operatorsMapping, {
      prefix: platformId,
      networkId,
    });
  };

  return {
    id: `${platformId}-csm-operators`,
    executor,
    labels: ['normal'],
  };
}
