import {
  NetworkId,
  TokenPriceSource,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getJupiterPrices } from './helpers';
import { walletTokensPlatform } from '../tokens/constants';
import { getMultipleDecimalsAsMap } from '../../utils/solana/getMultipleDecimalsAsMap';
import { getClientSolana } from '../../utils/clients';

const mints = [
  'HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX', // SolanaHub staked SOL
  'xLfNTYy76B8Tiix3hA51Jyvc1kMSFV4sPdR7szTZsRu', // xLifinity
];
const vsToken = solanaNativeWrappedAddress;

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const solTokenPrice = await cache.getTokenPrice(vsToken, NetworkId.solana);
  if (!solTokenPrice) return;

  const mintsPk = mints.map((m) => new PublicKey(m));
  const prices = await getJupiterPrices(mintsPk, new PublicKey(vsToken));
  const decimalsMap = await getMultipleDecimalsAsMap(connection, mintsPk);
  const sources: TokenPriceSource[] = [];
  prices.forEach((price, mint) => {
    const decimals = decimalsMap.get(mint);
    if (!decimals) return;
    const source: TokenPriceSource = {
      address: mint,
      decimals,
      id: 'jupiter-api',
      networkId: NetworkId.solana,
      timestamp: Date.now(),
      price: solTokenPrice.price * price,
      platformId: walletTokensPlatform.id,
      weight: 0.1,
    };
    sources.push(source);
  });
  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pricing`,
  executor,
  label: 'coingecko',
};
export default job;
