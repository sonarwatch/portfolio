import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { adxMint, alpMint, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { userStakingStruct } from './structs';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getAdxStakingAccountKey, getAlpStakingAccountKey } from './helpers';
import { getClientSolana } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const [alpStakingAccountKey, adxStakingAccountKey] = [
    getAlpStakingAccountKey(owner),
    getAdxStakingAccountKey(owner),
  ];
  const [alpStakingAccount, adxStakingAccount] =
    await getParsedMultipleAccountsInfo(client, userStakingStruct, [
      alpStakingAccountKey,
      adxStakingAccountKey,
    ]);

  if (!alpStakingAccount && !adxStakingAccount) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  if (alpStakingAccount) {
    const alpElement = elementRegistry.addElementMultiple({
      label: 'Staked',
      link: 'https://app.adrena.xyz/stake',
      ref: alpStakingAccount.pubkey.toString(),
    });
    for (const lockStake of alpStakingAccount.lockedStakes) {
      alpElement.addAsset({
        address: alpMint,
        amount: lockStake.stakeTime,
        attributes: {
          lockedUntil: lockStake.lockDuration.times(1000).toNumber(),
        },
      });
    }
  }

  if (adxStakingAccount) {
    const adxElement = elementRegistry.addElementMultiple({
      label: 'Staked',
      link: 'https://app.adrena.xyz/stake',
      ref: adxStakingAccount.pubkey.toString(),
    });
    for (const lockStake of adxStakingAccount.lockedStakes) {
      adxElement.addAsset({
        address: adxMint,
        amount: lockStake.stakeTime,
        attributes: {
          lockedUntil: lockStake.lockDuration.times(1000).toNumber(),
        },
      });
    }
    adxElement.addAsset({
      address: adxMint,
      amount: adxStakingAccount.liquidStake.stakeTime,
      attributes: { tags: ['Liquid'] },
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
