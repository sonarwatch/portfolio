import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwner } from '../../utils/solana/getTokenAccountsByOwner';
import { getHeliumPositions } from './getHeliumPositions';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = (await getTokenAccountsByOwner(owner)).filter((x) =>
    x.amount.isEqualTo(1)
  );

  return getHeliumPositions(potentialTokens, cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
