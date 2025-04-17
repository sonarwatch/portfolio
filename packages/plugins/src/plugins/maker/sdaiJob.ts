import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import BigNumber from 'bignumber.js';
import {
  chaiAddress,
  chaiDecimals,
  daiAddress,
  platformId,
  potAddress,
  sDaiAddress,
  sDaiDecimals,
} from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { potAbi } from './abis';

const executor: JobExecutor = async (cache: Cache) => {
  const daiTokenPrice = await cache.getTokenPrice(
    daiAddress,
    NetworkId.ethereum
  );
  if (!daiTokenPrice) return;

  const client = getEvmClient(NetworkId.ethereum);

  const chi = await client.readContract({
    abi: potAbi,
    functionName: 'chi',
    address: getAddress(potAddress),
  });
  const ratio = new BigNumber(chi.toString()).div(1e27);
  const price = ratio.times(daiTokenPrice.price).toNumber();
  const commonSourceInfo = {
    id: 'maker-pot',
    networkId: NetworkId.ethereum,
    platformId: walletTokensPlatformId,
    price,
    timestamp: Date.now(),
    weight: 0.5,
  };
  await cache.setTokenPriceSource({
    ...commonSourceInfo,
    address: chaiAddress,
    decimals: chaiDecimals,
  });
  await cache.setTokenPriceSource({
    ...commonSourceInfo,
    address: sDaiAddress,
    decimals: sDaiDecimals,
  });
};

const job: Job = {
  id: `${platformId}-sdai`,
  networkIds: [NetworkId.ethereum],
  executor,
  labels: ['normal', 'evm', NetworkId.ethereum],
};
export default job;
