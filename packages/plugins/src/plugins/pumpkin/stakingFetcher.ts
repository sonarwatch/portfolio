import { NetworkId } from '@sonarwatch/portfolio-core';
import { address } from '@solana/kit';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { platformId, stakingProgramId } from './constants';
import { getProgramAccounts } from '../../utils/solana/accounts/getProgramAccounts';
import { stakedCodec } from './codecs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const accounts = await getProgramAccounts(stakingProgramId, stakedCodec, [
    {
      key: 'user',
      val: address(owner),
    },
  ]);

  if (!accounts.length) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = registry.addElementMultiple({
      label: 'Staked',
      link: 'https://app.pumpkin.fun/stake',
      ref: account.address,
    });

    element.addAsset({
      address: account.data.mint,
      amount: account.data.amount,
    });
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
