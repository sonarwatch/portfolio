import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { nosMint, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { stakeStruct } from './structs';
import { getStakePubKey } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { tokenAccountStruct } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const stakeAccount = await getParsedAccountInfo(
    client,
    stakeStruct,
    getStakePubKey(owner)
  );
  if (!stakeAccount || stakeAccount.amount.isZero()) return [];

  const vaultAccount = await getParsedAccountInfo(
    client,
    tokenAccountStruct,
    stakeAccount.vault
  );
  if (!vaultAccount || vaultAccount.amount.isZero()) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const stakingElement = elementRegistry.addElementMultiple({
    label: 'Staked',
    ref: stakeAccount.pubkey.toString(),
    link: 'https://dashboard.nosana.com/stake',
    sourceRefs: [{ name: 'Vault', address: vaultAccount.pubkey.toString() }],
  });

  const lockedUntil = stakeAccount.timeUnstake.isZero()
    ? undefined
    : stakeAccount.timeUnstake
        .plus(stakeAccount.duration)
        .times(1000)
        .toNumber();

  stakingElement.addAsset({
    address: nosMint,
    amount: stakeAccount.amount,
    attributes: {
      lockedUntil,
    },
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
