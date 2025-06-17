import { NetworkId } from '@sonarwatch/portfolio-core';
import { clmmPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwnerMemo } from '../../utils/solana/getTokenAccountsByOwner';
import { getOrcaPositions } from '../orca/getWhirlpoolPositions';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = await getTokenAccountsByOwnerMemo(owner);

  return getOrcaPositions(platformId, clmmPid)(potentialTokens, cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-whirlpools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
