import { NetworkId } from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getPositionAddress } from './helpers';
import { getOrcaPositions } from './getWhirlpoolPositions';
import { getTokenAccountsByOwner } from '../../utils/solana/getTokenAccountsByOwner';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = (await getTokenAccountsByOwner(owner)).filter((x) =>
    x.amount.isEqualTo(1)
  );

  const positionAddresses = potentialTokens.map((x) =>
    getPositionAddress(x.mint)
  );

  return getOrcaPositions(platformId)(positionAddresses, cache);
};

const whirlpoolFetcher: Fetcher = {
  id: `${platformId}-whirlpools`,
  networkId: NetworkId.solana,
  executor,
};

export default whirlpoolFetcher;
