import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { sonicMint, platformId, stakingPid } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { userStakeIndexStruct } from './structs';
import { getParsedProgramAccounts } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const userStakeAccount = await getParsedProgramAccounts(
    connection,
    userStakeIndexStruct,
    stakingPid,
    [
      {
        dataSize: 97,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 61,
        },
      },
    ]
  );
  if (!userStakeAccount) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://stake.sonic.game/',
  });

  userStakeAccount.forEach((acc) => {
    const lockedUntil = acc.endAt.times(1000).toNumber();
    element.addAsset({
      address: sonicMint,
      amount: acc.amount,
      attributes: {
        lockedUntil,
      },
      ref: acc.pubkey.toString(),
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
