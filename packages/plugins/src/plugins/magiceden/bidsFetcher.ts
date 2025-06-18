import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ammPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { poolStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(client, poolStruct, ammPid)
    .addFilter('discriminator', [241, 154, 109, 4, 17, 177, 109, 188])
    .addFilter('owner', new PublicKey(owner))
    .addFilter('sharedEscrowCount', 0)
    .run();

  if (!accounts || accounts.length === 0) return [];

  const totalAmount = accounts.reduce((sum, acc) => {
    if (acc.expiry.toNumber() < Date.now() / 1000) return sum;

    return sum.plus(acc.spotPrice);
  }, new BigNumber(0));

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Deposit',
    name: 'Bids',
  });

  element.addAsset({
    address: solanaNativeAddress,
    amount: totalAmount,
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-bids`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
