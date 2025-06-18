import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getOrcaPositions } from './getWhirlpoolPositions';
import { getTokenAccountsByOwnerMemo } from '../../utils/solana/getTokenAccountsByOwner';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = (await getTokenAccountsByOwnerMemo(owner)).filter(
    (x) => x.amount.isEqualTo(1)
  );

  return getOrcaPositions(platformId)(potentialTokens, cache);
};

const whirlpoolFetcher: Fetcher = {
  id: `${platformId}-whirlpools`,
  networkId: NetworkId.solana,
  executor,
};

export default whirlpoolFetcher;
