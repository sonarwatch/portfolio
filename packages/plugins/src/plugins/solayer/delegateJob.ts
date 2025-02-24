import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, solayerRstMint, avsTokens } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const rstTokenPrice = await cache.getTokenPrice(
    solayerRstMint,
    NetworkId.solana
  );

  if (!rstTokenPrice) return;

  const sources: TokenPriceSource[] = [];

  avsTokens.forEach((avsToken) => {
    sources.push({
      address: avsToken,
      decimals: rstTokenPrice.decimals,
      id: platformId,
      networkId: NetworkId.solana,
      platformId,
      price: rstTokenPrice.price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Delegate',
      underlyings: [
        {
          address: solayerRstMint,
          decimals: rstTokenPrice.decimals,
          amountPerLp: 1,
          networkId: NetworkId.solana,
          price: rstTokenPrice.price,
        },
      ],
    });
  });

  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-delegate`,
  executor,
  labels: ['normal'],
};
export default job;
