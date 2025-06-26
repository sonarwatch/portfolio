import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getOrcaPositions } from './getWhirlpoolPositions';
import { getTokenAccountsByOwner } from '../../utils/solana/getTokenAccountsByOwner';
import { getClientSolana } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = await getTokenAccountsByOwner(
    getClientSolana(),
    owner
  );

  return getOrcaPositions(platformId)(potentialTokens, cache);
};

const whirlpoolFetcher: Fetcher = {
  id: `${platformId}-whirlpools`,
  networkId: NetworkId.solana,
  executor,
};

export default whirlpoolFetcher;
