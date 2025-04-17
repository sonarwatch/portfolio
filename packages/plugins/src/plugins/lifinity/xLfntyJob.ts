import {
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lfntyMint, platformId, xLfntyDecimals, xLfntyMint } from './constants';
import { getJupiterPrices } from '../jupiter/helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const lfntyTokenPrice = await cache.getTokenPrice(
    lfntyMint,
    NetworkId.solana
  );
  if (!lfntyTokenPrice) return;

  const prices = await getJupiterPrices(
    [new PublicKey(xLfntyMint)],
    new PublicKey(lfntyMint)
  );
  const price = prices.get(xLfntyMint);
  if (!price) return;

  const source: TokenPriceSource = {
    address: xLfntyMint,
    decimals: xLfntyDecimals,
    id: 'jupiter-api',
    networkId: NetworkId.solana,
    timestamp: Date.now(),
    price: price * lfntyTokenPrice.price,
    platformId: walletTokensPlatformId,
    weight: 0.5,
  };
  await cache.setTokenPriceSource(source);
};
const job: Job = {
  id: `${platformId}-xlfnty`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
