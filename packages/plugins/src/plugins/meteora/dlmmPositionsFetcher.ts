import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { dlmmProgramId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dlmmPositionStruct } from './struct';
import { dlmmPositionAccountFilter } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const dlmmPositions = await getParsedProgramAccounts(
    client,
    dlmmPositionStruct,
    dlmmProgramId,
    dlmmPositionAccountFilter(owner)
  );
  console.log('constexecutor:FetcherExecutor= ~ dlmmPositions:', dlmmPositions);

  for (const position of dlmmPositions) {
    console.log('Break');
    for (const share of position.liquidityShares) {
      console.log(share.toNumber());
    }
  }
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-dlmm-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
