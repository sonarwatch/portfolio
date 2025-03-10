import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { claimStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getPda } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const claim = await getParsedAccountInfo(
    connection,
    claimStruct,
    getPda(owner)
  );
  if (!claim || claim.amount.isZero()) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Airdrop',
    ref: claim.pubkey,
  });
  element.addAsset({
    address: claim.mintAddress.toString(),
    amount: claim.amount.dividedBy(10 ** 9),
    alreadyShifted: true,
    attributes: { isClaimable: true },
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-claim`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
