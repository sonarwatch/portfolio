import { NetworkId, walletTokensPlatformId } from '@sonarwatch/portfolio-core';

import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getTokenAccountsByOwner } from '../../../utils/solana/getTokenAccountsByOwner';
import { getSolanaTokens } from './solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const tokenAccounts = await getTokenAccountsByOwner(owner);

  return getSolanaTokens(true)(tokenAccounts, cache);
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatformId}-solana-simple`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
