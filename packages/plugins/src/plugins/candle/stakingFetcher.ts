import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { pid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { withdrawalStruct } from './structs';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const withdrawAccounts = await ParsedGpa.build(
    connection,
    withdrawalStruct,
    pid
  )
    .addFilter('discriminator', [10, 45, 211, 182, 129, 235, 90, 82])
    .addFilter('receiver', new PublicKey(owner))
    .addDataSizeFilter(105)
    .run();
  if (!withdrawAccounts) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://candle.tv/staking',
  });

  withdrawAccounts.forEach((withdraw) => {
    element.addAsset({
      address: 'A8bcY1eSenMiMy75vgSnp6ShMfWHRHjeM6JxfM1CNDL',
      amount: withdraw.amount,
      attributes: {
        lockedUntil: withdraw.endTs.times(1000).toNumber(),
        tags: ['Withdraw'],
      },
      ref: withdraw.pubkey.toString(),
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
