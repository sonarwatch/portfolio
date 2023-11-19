import { NetworkId } from '@sonarwatch/portfolio-core';
import { klendProgramId, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { obligationStruct } from '../solend/structs';
import { dataSizeFilter } from '../../utils/solana/filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const obligationAccounts = await getParsedProgramAccounts(
    client,
    obligationStruct,
    klendProgramId,
    dataSizeFilter(obligationStruct)
  );

  for (const obligationAccount of obligationAccounts) {
    console.log(obligationAccount);
  }
  return [];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
