import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { assetAbi, decimalsAbi, nameAbi } from './abis';
import { evmContracts, platformId } from './constants';
import { MaplePoolInfo } from './types';
import { poolsKey } from '../stargate/constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const nameBase = {
    abi: nameAbi,
    functionName: 'name',
  } as const;

  const decimalsBase = {
    abi: decimalsAbi,
    functionName: 'decimals',
  } as const;

  const assetBase = {
    abi: assetAbi,
    functionName: 'asset',
  } as const;

  const namesContracts = [];
  const decimalsContracts = [];
  const assetsContracts = [];
  for (const contract of evmContracts) {
    namesContracts.push({
      ...nameBase,
      address: contract as `0x${string}`,
    } as const);
    decimalsContracts.push({
      ...decimalsBase,
      address: contract as `0x${string}`,
    } as const);
    assetsContracts.push({
      ...assetBase,
      address: contract as `0x${string}`,
    } as const);
  }

  const [namesRes, decimalsRes, assetsRes] = await Promise.all([
    client.multicall({ contracts: namesContracts }),
    client.multicall({ contracts: decimalsContracts }),
    client.multicall({ contracts: assetsContracts }),
  ]);

  const poolsInfo: MaplePoolInfo[] = [];
  for (let i = 0; i < namesRes.length; i++) {
    const assetRes = assetsRes[i];
    const nameRes = namesRes[i];
    const decimalRes = decimalsRes[i];

    if (assetRes.status === 'failure' || decimalRes.status === 'failure')
      continue;

    const asset = assetRes.result;
    const decimal = decimalRes.result;
    const name = nameRes.status === 'failure' ? undefined : nameRes.result;

    poolsInfo.push({
      asset,
      contract: evmContracts[i],
      decimal,
      name,
    });
  }

  await cache.setItem(poolsKey, poolsInfo, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });
};

const job: Job = {
  id: `${platformId}-ethereum`,
  networkIds: [NetworkId.ethereum],
  executor,
  labels: ['normal', 'evm', NetworkId.ethereum],
};
export default job;
