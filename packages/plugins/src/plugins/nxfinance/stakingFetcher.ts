import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  platformId,
  stakePool,
  stakingPoolKey,
  stakingProgramId,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { stakeAccountStruct, StakePool } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const stakingAccount = (
    await getParsedMultipleAccountsInfo(connection, stakeAccountStruct, [
      PublicKey.findProgramAddressSync(
        [
          new PublicKey(stakePool).toBuffer(),
          Buffer.from('nx_account', 'utf8'),
          new PublicKey(owner).toBuffer(),
        ],
        new PublicKey(stakingProgramId)
      )[0],
    ])
  )[0];
  if (!stakingAccount) return [];

  const stakePoolAccount = await cache.getItem<ParsedAccount<StakePool>>(
    stakingPoolKey,
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  if (!stakePoolAccount) throw new Error('Stake pool not found in cache.');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    link: 'https://nxfinance.io/stake',
    ref: stakingAccount.pubkey.toString(),
    sourceRefs: [{ name: 'Pool', address: stakePoolAccount.pubkey.toString() }],
  });

  element.addAsset({
    address: stakePoolAccount.stakeTokenMint,
    amount: stakingAccount.stakedTokens,
  });

  element.addAsset({
    address: solanaNativeAddress,
    amount: stakingAccount.claimableReward,
    attributes: {
      isClaimable: true,
    },
  });

  element.addAsset({
    address: stakePoolAccount.stakeTokenMint,
    amount: stakingAccount.withdrawingTokens,
    attributes: {
      lockedUntil: new BigNumber(stakingAccount.timeOfWithdrawApply)
        .plus(14 * 24 * 60 * 60) // 14 days
        .multipliedBy(new BigNumber(1e3))
        .toNumber(),
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
