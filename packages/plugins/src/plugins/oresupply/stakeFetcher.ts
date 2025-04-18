import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { oreMint, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedBoost, stakeStruct } from './structs';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { getStakePdas } from './helpers';

const boostMemo = new MemoizedCache<ParsedBoost[]>('boosts', {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const boostAccounts = await boostMemo.getItem(cache);
  if (!boostAccounts) throw new Error('Boosts not found in cache');

  const stakeAccounts = await getParsedMultipleAccountsInfo(
    connection,
    stakeStruct,
    getStakePdas(
      owner,
      boostAccounts.map((b) => b.pubkey)
    )
  );
  if (!stakeAccounts.some((acc) => acc)) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementLiquidity({
    label: 'Farming',
  });
  stakeAccounts.forEach((acc) => {
    if (!acc) return;

    const boostAcc = boostAccounts.find(
      (b) => b.pubkey === acc.boost.toString()
    );
    if (!boostAcc) return;

    const liq = element.addLiquidity({
      ref: acc.pubkey,
      link: `https://ore.supply/stake/${boostAcc.mint.toString()}`,
      sourceRefs: [
        {
          address: boostAcc.pubkey.toString(),
          name: 'Pool',
        },
      ],
    });

    liq.addAsset({
      address: boostAcc.mint,
      amount: acc.balance,
    });

    liq.addRewardAsset({
      address: oreMint,
      amount: acc.rewards,
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
