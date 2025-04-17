import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { divvyProgram, houseCacheKey, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { houseStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const houses = await ParsedGpa.build(connection, houseStruct, divvyProgram)
    .addFilter('accountDiscriminator', [21, 145, 94, 109, 254, 199, 210, 151])
    .run();

  const tokenPrices = await cache.getTokenPricesAsMap(
    houses.map((h) => h.currency.toString()),
    NetworkId.solana
  );

  const tokenPriceSources: TokenPriceSource[] = [];

  houses.forEach((house) => {
    const tokenPrice = tokenPrices.get(house.currency.toString());
    if (!tokenPrice) return;

    const ratio = new BigNumber(house.liquidity).dividedBy(
      house.houseTokenSupply
    );

    tokenPriceSources.push({
      address: house.houseMint.toString(),
      decimals: house.currencyDecimals,
      id: house.houseMint.toString(),
      networkId: NetworkId.solana,
      platformId,
      price: ratio.times(tokenPrice.price).toNumber(),
      underlyings: [
        {
          address: house.currency.toString(),
          amountPerLp: ratio.toNumber(),
          decimals: house.currencyDecimals,
          networkId: tokenPrice.networkId,
          price: tokenPrice.price,
        },
      ],
      timestamp: Date.now(),
      weight: 1,
    });
  });

  await Promise.all([
    cache.setTokenPriceSources(tokenPriceSources),
    cache.setItem(houseCacheKey, houses, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);
};

const job: Job = {
  id: `${platformId}-house`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
