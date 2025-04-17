import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, avsTokens, solayerLstMint } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const rstTokenPrice = await cache.getTokenPrice(
    solayerLstMint,
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
          address: solayerLstMint,
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
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
