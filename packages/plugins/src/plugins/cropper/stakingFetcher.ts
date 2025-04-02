import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { crpMint, platformId, stakingPid } from './constants';
import { getClientSolana } from '../../utils/clients';
import { userStakingStruct } from './struct';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(client, userStakingStruct, stakingPid)
    .addFilter('authority', new PublicKey(owner))
    .run();
  if (!accounts) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const element = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://staking.defiland.app/',
  });

  for (const stakingAcc of accounts) {
    element.addAsset({
      address: crpMint,
      amount: stakingAcc.amount.dividedBy(10 ** 9),
      alreadyShifted: true,
      attributes: {
        lockedUntil: stakingAcc.lastStakeTime
          .plus(stakingAcc.lockDuration)
          .times(1000)
          .toNumber(),
      },
      ref: stakingAcc.pubkey,
      link: 'https://cropper.finance/staking/',
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
