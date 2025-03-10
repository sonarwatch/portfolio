import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { custodiesCacheKey, pid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { positionStruct } from './structs';
import { getParsedProgramAccounts } from '../../utils/solana';
import { positionFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import { CachedCustody } from './types';

const custodiesMemo = new MemoizedCache<CachedCustody[]>(custodiesCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const custodies = await custodiesMemo.getItem(cache);

  const positions = await getParsedProgramAccounts(
    client,
    positionStruct,
    pid,
    positionFilter(owner)
  );

  if (!positions) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({ label: 'Leverage' });
  for (const position of positions) {
    const custodie = custodies.find(
      (c) => c.pubkey === position.custody.toString()
    );
    if (!custodie) continue;

    element.addAsset({
      address: custodie.mint.toString(),
      amount: position.collateralAmount,
      ref: position.pubkey,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
