import {
  NetworkId,
  solanaNativeWrappedAddress,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getSwitchboardOnDemandPrices } from './helpers/getSwitchboardOnDemandPrice';
import { getDecimalsForToken } from '../../utils/misc/getDecimalsForToken';
import { SwitchboardTokenPricingInfo } from './types';
import { usdcSolanaMint, crtSolanaMint } from '../../utils/solana';
import { pstMint } from '../huma/constants';

const feedsToFetch: SwitchboardTokenPricingInfo[] = [
  {
    feedsAddresses: [
      'Ceveqpim1FJZfx9DPeFDVDSz2HJavUqPPEJtZ2osNEmS',
      'E8TLLh5jkYDvSXfAES7qe3s8Cfjj4hyvjksuvUHe8NEw',
      'BSzfJs4d1tAkSDqkepnfzEVcx2WtDVnwwXa2giy9PLeP',
    ],
    networkId: NetworkId.solana,
    mintAddress: solanaNativeWrappedAddress,
  },
  {
    feedsAddresses: ['2Dv72h14k6ynrUvQ8mhu5ihwrk1Kte6Aj2tpKhXLsHrR'],
    mintAddress: usdcSolanaMint,
    networkId: NetworkId.solana,
  },
  {
    feedsAddresses: ['GQbKvThYgyvdp8T8MoE8KKD2NngXumQ8mDkCLxmhvJKm'],
    mintAddress: crtSolanaMint,
    networkId: NetworkId.solana,
  },
  {
    feedsAddresses: ['EcSxuQKGVQUTQJNsayW5X6CHcnZjbfYNkCSHbN7ndb22'],
    mintAddress: pstMint,
    networkId: NetworkId.solana,
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const sources: TokenPriceSource[] = [];

  for (const tokenInfo of feedsToFetch) {
    const values = await getSwitchboardOnDemandPrices(
      connection,
      tokenInfo.feedsAddresses.map((t) => new PublicKey(t))
    );

    const decimals = await getDecimalsForToken(
      tokenInfo.mintAddress,
      NetworkId.solana
    );

    tokenInfo.feedsAddresses.forEach((feedToFetch, i) => {
      const price = values.at(i);
      if (!price || !decimals) return;

      const source: TokenPriceSource = {
        address: tokenInfo.mintAddress,
        decimals,
        id: `${platformId}-feed-${feedToFetch.toString()}`,
        networkId: tokenInfo.networkId,
        platformId: walletTokensPlatformId,
        weight: 0.8,
        timestamp: Date.now(),
        price,
      };
      sources.push(source);
    });
  }

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-ondemand-pricing`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['realtime', NetworkId.solana],
};
export default job;
