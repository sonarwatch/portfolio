import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { divvyIdlItem, houseCacheKey, platformId } from './constants';
import { getAutoParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { House } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const houses = (
    await Promise.all([
      getAutoParsedProgramAccounts<House>(connection, divvyIdlItem, [
        {
          dataSize: 302,
        },
      ]),
      getAutoParsedProgramAccounts<House>(connection, divvyIdlItem, [
        {
          dataSize: 294,
        },
      ]),
    ])
  ).flat();

  const tokenPrices = await cache.getTokenPricesAsMap(
    houses.map((m) => m.currency),
    NetworkId.solana
  );

  const tokenPriceSources = [];

  for (const house of houses) {
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
  }

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
  executor,
  label: 'normal',
};

export default job;
