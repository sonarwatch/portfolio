import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwnerMemo } from '../../utils/solana/getTokenAccountsByOwner';
import { getClmmPositions } from './getClmmPositions';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = (await getTokenAccountsByOwnerMemo(owner)).filter(
    (x) => x.amount.isEqualTo(1)
  );

  return getClmmPositions(potentialTokens, cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-clmm`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
