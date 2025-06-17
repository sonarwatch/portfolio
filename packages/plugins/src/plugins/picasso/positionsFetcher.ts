import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwnerMemo } from '../../utils/solana/getTokenAccountsByOwner';
import { getPicassoPositions } from './getPicassoPositions';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = await getTokenAccountsByOwnerMemo(owner);

  return getPicassoPositions(potentialTokens, cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
