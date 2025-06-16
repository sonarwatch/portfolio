import { NetworkId } from '@sonarwatch/portfolio-core';
import { clmmPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwner } from '../../utils/solana/getTokenAccountsByOwner';
import { getOrcaPositions } from '../orca/getWhirlpoolPositions';
import { getPositionAddress } from '../orca/helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = (await getTokenAccountsByOwner(owner)).filter((x) =>
    x.amount.isEqualTo(1)
  );

  const positionAddresses = potentialTokens.map((x) =>
    getPositionAddress(x.mint, clmmPid)
  );

  return getOrcaPositions(platformId)(positionAddresses, cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-whirlpools`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
