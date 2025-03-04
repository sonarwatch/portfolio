import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { poolStakeStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const lockupAccounts = await getParsedProgramAccounts(
    client,
    poolStakeStruct,
    stakingPid,
    [
      { dataSize: poolStakeStruct.byteSize },
      {
        memcmp: {
          offset: 8,
          bytes: owner,
        },
      },
    ]
  );
  if (!lockupAccounts) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://stake.gpool.cloud/',
  });

  for (const lockupAccount of lockupAccounts) {
    element.addAsset({
      address: lockupAccount.mint,
      amount: lockupAccount.balance,
      ref: lockupAccount.pubkey,
    });
  }
  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
