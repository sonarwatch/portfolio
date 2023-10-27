import {
  NetworkId,
  TokenPrice,
  TokenPriceSource,
  TokenPriceUnderlying,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getPairsV2 } from './helpers';
import { platformId } from '../uniswap/constants';
import { pairsV2Key, theGraphUrl } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const pairs = await getPairsV2(theGraphUrl);
  const tokenAddresses = [
    ...new Set(pairs.map((p) => [p.token0.id, p.token1.id]).flat()),
  ];
  const tokenPrices = await cache.getTokenPrices(
    tokenAddresses,
    NetworkId.ethereum
  );
  const tokenPricesByAddress: Map<string, TokenPrice> = new Map();
  tokenPrices.forEach((tp) => {
    if (!tp) return;
    tokenPricesByAddress.set(tp.address, tp);
  });

  const pairAddresses: string[] = [];
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    const underlyingsTokens = [
      [pair.token0.id, pair.reserve0],
      [pair.token1.id, pair.reserve1],
    ] as const;
    const underlyings: TokenPriceUnderlying[] = [];
    let tvl = new BigNumber(0);
    for (let j = 0; j < underlyingsTokens.length; j++) {
      const [address, amount] = underlyingsTokens[j];
      const fAddress = formatTokenAddress(address, NetworkId.ethereum);
      const tokenPrice = tokenPricesByAddress.get(fAddress);
      if (!tokenPrice) break;
      tvl = tvl.plus(new BigNumber(amount).times(tokenPrice.price));
      underlyings.push({
        networkId: NetworkId.ethereum,
        address: fAddress,
        decimals: tokenPrice.decimals,
        price: tokenPrice.price,
        amountPerLp: new BigNumber(amount).div(pair.totalSupply).toNumber(),
      });
    }
    if (underlyings.length !== underlyingsTokens.length) continue;

    const price = tvl.div(pair.totalSupply).toNumber();
    const lpAddress = formatTokenAddress(pair.id, NetworkId.ethereum);
    const source: TokenPriceSource = {
      id: platformId,
      address: lpAddress,
      decimals: 18,
      networkId: NetworkId.ethereum,
      platformId,
      price,
      timestamp: Date.now(),
      weight: 1,
      elementName: 'Uniswap V2',
      underlyings,
    };
    await cache.setTokenPriceSource(source);
    pairAddresses.push(lpAddress);
  }

  await cache.setItem(pairsV2Key, pairAddresses, {
    prefix: platformId,
    networkId: NetworkId.ethereum,
  });
};

const job: Job = {
  id: `${platformId}-v2`,
  executor,
};
export default job;
