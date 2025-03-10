import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { meMint, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { lockUpStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getStakingAccount } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const lockupAccount = await getParsedAccountInfo(
    client,
    lockUpStruct,
    getStakingAccount(owner)
  );
  if (!lockupAccount) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://magiceden.io/earn',
    ref: lockupAccount.pubkey.toString(),
  });

  element.addAsset({
    address: meMint,
    amount: lockupAccount.amount,
    attributes: {
      lockedUntil: lockupAccount.endTs.times(1000).toNumber(),
    },
  });
  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
