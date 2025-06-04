import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  platformId,
  stakePid,
  stakingPoolsCacheKey
} from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { stakeAccountStruct, Tag } from './structs';

const MAX_CACHED_POOLS = 1000;

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  try {
    const stakeAccounts = await getParsedProgramAccounts(
      connection,
      stakeAccountStruct,
      stakePid,
      [
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(Buffer.from([Tag.StakeAccount])),
          },
        },
      ]
    );

    const uniqueStakePools = new Set<string>();

    for (const account of stakeAccounts) {
      if (account && account.stakePool) {
        uniqueStakePools.add(account.stakePool.toString());
      }
    }

    const stakingPoolAddresses = Array.from(uniqueStakePools).map(
      poolAddress => new PublicKey(poolAddress)
    );

    const poolCount = stakingPoolAddresses.length;
    console.log(`Found ${poolCount} unique staking pools`);

    // We don't want to slow down getMultipleAccountsInfo.
    // If the number of pools is too high, it's better to use getParsedProgramAccounts directly in fetcher.
    if (poolCount < MAX_CACHED_POOLS) {
      await cache.setItem(stakingPoolsCacheKey, stakingPoolAddresses, {
        prefix: cachePrefix,
        networkId: NetworkId.solana,
      });
    } else {
      console.log(`Skipping cache: too many pools (${poolCount})`);
    }
  } catch (error) {
    console.error('Error fetching staking pools:', error);
    await cache.setItem(stakingPoolsCacheKey, [], {
      prefix: cachePrefix,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-staking-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};

export default job;
