import { NetworkId } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import BigNumber from 'bignumber.js';
import { liteConfigs, platformId } from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { liteAbi } from './abis';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  for (let i = 0; i < liteConfigs.length; i++) {
    const config = liteConfigs[i];
    const uTokenPrice = await cache.getTokenPrice(
      config.underlyingAddress,
      NetworkId.ethereum
    );
    if (!uTokenPrice) continue;
    const exchangePrice = await client.readContract({
      abi: liteAbi,
      functionName: 'exchangePrice',
      address: getAddress(config.address),
    });
    const ratio = new BigNumber(exchangePrice.toString())
      .dividedBy(10 ** config.decimals)
      .toNumber();

    await cache.setTokenPriceSource({
      networkId: NetworkId.ethereum,
      platformId,
      price: ratio * uTokenPrice.price,
      timestamp: Date.now(),
      weight: 1,
      elementName: config.name,
      underlyings: [
        {
          address: uTokenPrice.address,
          amountPerLp: ratio,
          networkId: uTokenPrice.networkId,
          price: uTokenPrice.price,
          decimals: uTokenPrice.decimals,
        },
      ],
      address: config.address,
      id: `${platformId}-lite`,
      decimals: uTokenPrice.decimals,
    });
  }
};

const job: Job = {
  id: `${platformId}-lite`,
  executor,
};
export default job;
