import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { cloudMint, platformId, stakingPid } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { vestingStruct } from './struct';

const vestingTime = 60 * 60 * 24 * 30; // 30 days

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [vestingAccounts] = await Promise.all([
    getParsedProgramAccounts(client, vestingStruct, stakingPid, [
      { memcmp: { offset: 8, bytes: owner } },
      { dataSize: vestingStruct.byteSize },
    ]),
  ]);

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  const stakingElement = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://vote.sanctum.so/cloud-staking?tab=stake',
  });

  for (const vestingAccount of vestingAccounts) {
    stakingElement.addAsset({
      address: cloudMint,
      amount: vestingAccount.amount.minus(vestingAccount.claimed).toNumber(),
      attributes: {
        lockedUntil: vestingAccount.start
          .plus(vestingTime)
          .times(1000)
          .toNumber(),
        tags: ['Unstaking'],
      },
      ref: vestingAccount.pubkey.toString(),
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
