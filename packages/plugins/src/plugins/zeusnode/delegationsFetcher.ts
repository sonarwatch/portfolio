import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, zeusMint, zeusNodeDelegateContract } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { delegationStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    delegationStruct,
    new PublicKey(zeusNodeDelegateContract.address)
  )
    .addFilter('accountDiscriminator', [47, 21, 138, 89, 209, 154, 59, 130])
    .addFilter('delegator', new PublicKey(owner))
    .run();

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
    });

    if (
      account.startedRemovalAt.isZero() ||
      Date.now() - account.startedRemovalAt.toNumber() > 1296000
    ) {
      element.addAsset({
        address: zeusMint,
        amount: account.claimableAmount,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-delegations`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
