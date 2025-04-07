import 'reflect-metadata';
import { Address, ContractFunctionConfig } from 'viem';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  aave3PlatformId,
  yieldAssetsPrefix,
  yieldConfigs,
  yieldPoolsPrefix,
} from './constants';
import { getEvmClients } from '../../utils/clients';
import { stataFactoryAbi, stataLegacyFactoryAbi, stataTokenAbi } from './abi';
import { YieldData } from './types';
import { ethFactorBigInt } from '../../utils/evm/constants';

const PLATFORM_ID = aave3PlatformId;

const executor: JobExecutor = async (cache: Cache) => {
  const evmClients = getEvmClients();

  const allConfigs = Array.from(yieldConfigs.values()).flat();

  for (const config of allConfigs) {
    const { networkId } = config;
    const client = evmClients[networkId];

    const staticAssets = await client.readContract({
      address: config.factory,
      abi: [...stataLegacyFactoryAbi, ...stataFactoryAbi],
      functionName: config.isLegacy ? 'getStaticATokens' : 'getStataTokens',
    });

    await cache.setItem(config.factory, staticAssets, {
      networkId,
      prefix: yieldAssetsPrefix,
    });

    const calls = staticAssets.flatMap<
      ContractFunctionConfig<typeof stataTokenAbi>
    >((a) => [
      {
        address: a,
        abi: stataTokenAbi,
        functionName: 'asset',
      },
      {
        address: a,
        abi: stataTokenAbi,
        functionName: 'convertToAssets',
        args: [ethFactorBigInt],
      },
    ]);

    const yieldDataResult = await client.multicall({
      contracts: calls,
    });

    for (let i = 0; i < staticAssets.length; i++) {
      const asset = staticAssets[i];
      const assetInfo = yieldDataResult[i * 2];
      const conversionInfo = yieldDataResult[i * 2 + 1];

      if (
        assetInfo.status !== 'success' ||
        conversionInfo.status !== 'success'
      ) {
        continue;
      }

      const assetAddress = assetInfo.result as Address;
      const conversionRate = conversionInfo.result as bigint;

      await cache.setItem<YieldData>(
        asset,
        {
          conversionRate: conversionRate.toString(),
          underlyingAssetAddress: assetAddress,
          elementName: config.elementName,
        },
        {
          networkId,
          prefix: yieldPoolsPrefix,
        }
      );
    }
  }
};

const job: Job = {
  id: `${PLATFORM_ID}-yield-pools`,
  executor,
  labels: ['normal'],
};
export default job;
