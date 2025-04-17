import {
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getSwitchboardPrices } from './helpers/getSwitchboardPrices';
import { getMultipleDecimalsAsMap } from '../../utils/solana/getMultipleDecimalsAsMap';

const feedsToFetch = [
  {
    feedAddress: new PublicKey('8LtARpjD6KsDGep66RPs1t5j8He766rhbYp3Dx7bNvGo'),
    mintAddress: 'ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo',
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const values = await getSwitchboardPrices(
    connection,
    feedsToFetch.map((fToFetch) => fToFetch.feedAddress)
  );
  const decimalsMap = await getMultipleDecimalsAsMap(
    connection,
    feedsToFetch.map((fToFetch) => new PublicKey(fToFetch.mintAddress))
  );

  const sources: TokenPriceSource[] = [];
  feedsToFetch.forEach((feedToFetch, i) => {
    const price = values.at(i);
    if (!price) return;
    const decimals = decimalsMap.get(feedToFetch.mintAddress);
    if (!decimals) return;
    const source: TokenPriceSource = {
      address: feedToFetch.mintAddress,
      decimals,
      id: `${platformId}-feed-${feedToFetch.feedAddress.toString()}`,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatformId,
      weight: 0.5,
      timestamp: Date.now(),
      price,
    };
    sources.push(source);
  });

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pricing`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['coingecko', NetworkId.solana],
};
export default job;
