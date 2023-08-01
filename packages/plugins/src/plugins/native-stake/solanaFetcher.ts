import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { stakeAccountsFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedProgramAccounts,
  getProgramAccountsSafe,
} from '../../utils/solana';

const stakeProgramId = new PublicKey(
  'Stake11111111111111111111111111111111111111'
);

const STATES = {
  2: 'delegated',
  1: 'inactive',
};

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const filters = stakeAccountsFilter(owner.toString());

  // const programAccounts = await getParsedProgramAccounts(
  //   client,
  //   STAKE_ACCOUNT_LAYOUT
  //   stakeProgramId,
  //   filters
  // );
  // if (programAccounts.length === 0) return [];

  // const miscStakes = {
  //   id: `${owner.toString()}_solana_staking`,
  //   owner: owner.toString(),
  //   platform: 'solana',
  //   method: 'solana_staking',
  //   value: 0,
  //   additional: {
  //     stakes: [],
  //   },
  // };
  // for (let i = 0; i < programAccounts.length; i += 1) {
  //   const stakeAccount = programAccounts[i];
  //   const amount = new BigNumber(stakeAccount.account.lamports)
  //     .dividedBy(new BigNumber(10 ** 9))
  //     .toNumber();
  //   const value = amount * solPrice;
  //   const parsed = STAKE_ACCOUNT_LAYOUT.decode(stakeAccount.account.data);
  //   const { voter, state } = parsed;
  //   const newStake = {
  //     address: stakeAccount.pubkey.toString(),
  //     value,
  //     voter: voter.toString(),
  //     amount,
  //     state: STATES[state],
  //   };
  //   miscStakes.additional.stakes.push(newStake);
  // }
  // const value = miscStakes.additional.stakes.reduce((a, b) => a + b.value, 0);
  // miscStakes.value = value;
  // return [miscStakes];
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
