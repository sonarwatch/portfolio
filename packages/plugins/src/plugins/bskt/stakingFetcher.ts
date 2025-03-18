import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { bsktMint, bsktStakingPid, platformId } from './constants';
import { stakingAccountStruct } from './structs';
import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await ParsedGpa.build(
    client,
    stakingAccountStruct,
    bsktStakingPid
  )
    .addFilter('accountDiscriminator', [210, 98, 254, 196, 151, 68, 235, 0])
    .addFilter('owner', new PublicKey(owner))
    .run();

  if (!accounts.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      ref: account.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: account.stakePool.toString(),
        },
      ],
      link: 'https://staking.bskt.fi/',
    });

    element.addAsset({
      address: bsktMint,
      amount: account.depositAmount,
      attributes: {
        lockedUntil: account.depositTimestamp
          .plus(account.lockupDuration)
          .toNumber(),
      },
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
