import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, stakeRegistryId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getPositionAccounts } from './utils';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { positionDataStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => [];

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
