import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { dflMint, platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { userStateStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const lockupAccounts = await getParsedProgramAccounts(
    client,
    userStateStruct,
    stakingPid,
    [
      { dataSize: userStateStruct.byteSize },
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
    link: 'https://staking.defiland.app/',
  });

  for (const lockupAccount of lockupAccounts) {
    element.addAsset({
      address: dflMint,
      amount: lockupAccount.stakedTokenBalance,
      ref: lockupAccount.pubkey,
      sourceRefs: [
        { name: 'Pool', address: lockupAccount.poolAddress.toString() },
      ],
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
