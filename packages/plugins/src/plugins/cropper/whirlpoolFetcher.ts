import { NetworkId } from '@sonarwatch/portfolio-core';
import { clmmPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwner } from '../../utils/solana/getTokenAccountsByOwner';
import { getOrcaPositions } from '../orca/getWhirlpoolPositions';
import { getClientSolana } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = await getTokenAccountsByOwner(
    getClientSolana(),
    owner
  );

  return getOrcaPositions(platformId, clmmPid)(potentialTokens, cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-whirlpools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
