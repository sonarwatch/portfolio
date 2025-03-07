import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { hxroMint, pid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeRewardsStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    connection,
    stakeRewardsStruct,
    pid,
    [
      {
        dataSize: 384,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 8,
        },
      },
    ]
  );
  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://app.hxro.finance/stake',
  });

  accounts.forEach((acc) => {
    element.addAsset({
      address: hxroMint,
      amount: acc.stakeState.amountStaked,
      attributes: {
        lockedUntil: acc.depositTimestamp
          .plus(acc.stakeDuration)
          .times(1000)
          .toNumber(),
      },
      ref: acc.pubkey,
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
