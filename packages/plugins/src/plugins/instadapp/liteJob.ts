import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import BigNumber from 'bignumber.js';
import { liteConfigs, platformId } from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { liteAbiV1, liteAbiV2 } from './abis';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);

  const sources: TokenPriceSource[] = [];
  for (let i = 0; i < liteConfigs.length; i++) {
    const config = liteConfigs[i];
    const uTokenPrice = await cache.getTokenPrice(
      config.underlyingAddress,
      NetworkId.ethereum
    );
    if (!uTokenPrice) continue;

    // Get exchange price
    let exchangePrice: bigint;
    if (config.version === 2) {
      exchangePrice = await client.readContract({
        abi: liteAbiV2,
        functionName: 'exchangePrice',
        address: getAddress(config.address),
      });
    } else if (config.version === 1) {
      [exchangePrice] = await client.readContract({
        abi: liteAbiV1,
        functionName: 'getCurrentExchangePrice',
        address: getAddress(config.address),
      });
    } else continue;

    const ratio = new BigNumber(exchangePrice.toString())
      .dividedBy(10 ** 18)
      .toNumber();

    sources.push({
      networkId: NetworkId.ethereum,
      platformId,
      price: ratio * uTokenPrice.price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Instadapp lite',
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
      decimals: config.decimals,
    });
  }

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-lite`,
  executor,
  labels: ['normal', 'evm', 'ethereum'],
};
export default job;
