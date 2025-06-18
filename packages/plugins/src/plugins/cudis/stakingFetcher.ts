import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { cudisMint, platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { userStakeRecordStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    userStakeRecordStruct,
    stakingPid
  )
    .addFilter('user', new PublicKey(owner))
    .addFilter('discriminator', [2, 228, 217, 21, 212, 139, 4, 208])
    .debug()
    .run();
  if (!accounts) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  for (const stakingAcc of accounts) {
    if (stakingAcc.isUnstake) continue;

    const element = registry.addElementMultiple({
      label: 'Staked',
      link: 'https://app.cudis.xyz/stake',
      ref: stakingAcc.pubkey,
    });
    element.addAsset({
      address: cudisMint,
      amount: stakingAcc.amount.dividedBy(10 ** 9),
      alreadyShifted: true,
      attributes: {
        lockedUntil: stakingAcc.endTs.times(1000).toNumber(),
      },
    });
    element.addAsset({
      address: cudisMint,
      amount: stakingAcc.earnings.dividedBy(10 ** 9),
      alreadyShifted: true,
      attributes: {
        lockedUntil: stakingAcc.endTs.times(1000).toNumber(),
      },
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
