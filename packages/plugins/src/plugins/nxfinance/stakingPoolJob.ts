import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getAutoParsedMultipleAccountsInfo } from '../../utils/solana';
import {
  nxfinanceStakingIdlItem,
  platformId,
  stakingPoolKey,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { StakingPoolAccount } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const stakePoolAccount = (
    await getAutoParsedMultipleAccountsInfo<StakingPoolAccount>(
      connection,
      nxfinanceStakingIdlItem,
      [new PublicKey('2P1eeegdbEhN3bnCroJJPXiH13i4rw1XYk8ftdh9meRY')]
    )
  )[0];

  await cache.setItem(stakingPoolKey, stakePoolAccount, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-staking-pool`,
  executor,
  labels: ['normal'],
};
export default job;
