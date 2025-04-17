import { PublicKey } from '@solana/web3.js';
import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { platformId } from './constants';
import {
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  tokenAccountStruct,
} from '../../utils/solana';
import {
  farmAccountV3Filters,
  farmAccountV4Filters,
  farmAccountV5Filters,
  userFarmAccountV31Filters,
  userFarmAccountV3Filters,
  userFarmAccountV4Filters,
  userFarmAccountV51Filters,
  userFarmAccountV5Filters,
} from './filters';
import {
  farmAccountV3Struct,
  farmAccountV4Struct,
  farmAccountV5Struct,
  userFarmAccountV31Struct,
  userFarmAccountV3Struct,
  userFarmAccountV4Struct,
  userFarmAccountV5Struct,
} from './structs/farms';
import { FarmConfig, FarmInfo, UserFarmConfig } from './types';
import { getFarmYield } from './helpers';

export const farmProgramIdV3 = new PublicKey(
  'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q'
);
export const farmProgramIdV4 = new PublicKey(
  'CBuCnLe26faBpcBP2fktp4rp8abpcAnTWft6ZrP5Q4T'
);
export const farmProgramIdV5 = new PublicKey(
  '9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z'
);

export const userFarmConfigs: UserFarmConfig[] = [
  {
    programId: farmProgramIdV3,
    filters: userFarmAccountV3Filters,
    struct: userFarmAccountV3Struct,
    version: 'v3',
  },
  {
    programId: farmProgramIdV4,
    filters: userFarmAccountV4Filters,
    struct: userFarmAccountV4Struct,
    version: 'v4',
  },
  {
    programId: farmProgramIdV5,
    filters: userFarmAccountV5Filters,
    struct: userFarmAccountV5Struct,
    version: 'v5',
  },
  {
    programId: farmProgramIdV5,
    filters: userFarmAccountV51Filters,
    struct: userFarmAccountV4Struct,
    version: 'v5_1', // Version 5_1, struct from V4 but pid from V5
  },
  {
    programId: farmProgramIdV3,
    filters: userFarmAccountV31Filters,
    struct: userFarmAccountV31Struct,
    version: 'v3_1',
  },
];

export const farmConfigs: FarmConfig[] = [
  {
    programId: farmProgramIdV3,
    filters: farmAccountV3Filters,
    struct: farmAccountV3Struct,
    version: 'v3',
    d: 1e9,
  },
  {
    programId: farmProgramIdV4,
    filters: farmAccountV4Filters,
    struct: farmAccountV4Struct,
    version: 'v4',
    d: 1e9,
  },
  {
    programId: farmProgramIdV5,
    filters: farmAccountV5Filters,
    struct: farmAccountV5Struct,
    version: 'v5',
    d: 1e15,
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const farmAccountsPromises = farmConfigs.map((farmConfig) =>
    getParsedProgramAccounts(
      client,
      farmConfig.struct,
      farmConfig.programId,
      farmConfig.filters
    )
  );
  const farmAccounts = (await Promise.all(farmAccountsPromises))
    .map((farmAccountsArray, i) =>
      farmAccountsArray.map((fa) => ({ ...fa, d: farmConfigs[i].d }))
    )
    .flat(1);

  const tokenAccountsToFetch: PublicKey[] = [];
  farmAccounts.forEach((farmAccount) => {
    if (
      farmAccount.poolLpTokenAccount.toString() ===
      '11111111111111111111111111111111'
    )
      return;
    tokenAccountsToFetch.push(
      farmAccount.poolLpTokenAccount,
      farmAccount.poolRewardTokenAccount
    );
    if (farmAccount.poolRewardTokenAccountB)
      tokenAccountsToFetch.push(farmAccount.poolRewardTokenAccountB);
  });
  const parsedTokenAccounts = await getParsedMultipleAccountsInfo(
    client,
    tokenAccountStruct,
    tokenAccountsToFetch
  );
  const tokenAccountsMap: Map<string, TokenAccount> = new Map();
  parsedTokenAccounts.forEach((parsedTokenAccount) => {
    if (!parsedTokenAccount) return;
    tokenAccountsMap.set(
      parsedTokenAccount.pubkey.toString(),
      parsedTokenAccount
    );
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    parsedTokenAccounts
      .map((account) => {
        if (account) return account.mint.toString();
        return [];
      })
      .flat(),
    NetworkId.solana
  );

  const promises = [];
  for (let i = 0; i < farmAccounts.length; i += 1) {
    const farmAccount = farmAccounts[i];
    const poolLpTokenAccount = tokenAccountsMap.get(
      farmAccount.poolLpTokenAccount.toString()
    );
    if (!poolLpTokenAccount) continue;

    const lpToken = tokenPriceById.get(poolLpTokenAccount.mint.toString());
    if (!lpToken) continue;

    const tvl = poolLpTokenAccount.amount
      .div(10 ** lpToken.decimals)
      .times(lpToken.price)
      .toNumber();

    let rewardTokenA: TokenPrice | undefined;
    let rewardTokenB: TokenPrice | undefined;

    const yields = [];
    // Yield A
    if (tvl > 0 && !farmAccount.perBlock.isZero()) {
      const poolRewardTokenAccount = tokenAccountsMap.get(
        farmAccount.poolRewardTokenAccount.toString()
      );
      if (poolRewardTokenAccount)
        rewardTokenA = tokenPriceById.get(
          poolRewardTokenAccount.mint.toString()
        );
      if (rewardTokenA)
        yields.push(getFarmYield(rewardTokenA, farmAccount.perBlock, tvl));
    }

    // Yield B
    if (
      tvl > 0 &&
      farmAccount.poolRewardTokenAccountB &&
      farmAccount.perBlockB &&
      !farmAccount.perBlockB.isZero()
    ) {
      const poolRewardTokenAccountB = tokenAccountsMap.get(
        farmAccount.poolRewardTokenAccountB.toString()
      );
      if (poolRewardTokenAccountB)
        rewardTokenB = tokenPriceById.get(
          poolRewardTokenAccountB.mint.toString()
        );
      if (rewardTokenB)
        yields.push(getFarmYield(rewardTokenB, farmAccount.perBlockB, tvl));
    }

    const farmInfo: FarmInfo = {
      account: farmAccount,
      lpToken,
      yields,
      rewardTokenA,
      rewardTokenB,
      d: farmAccount.d,
    };

    promises.push(
      cache.setItem(farmAccount.pubkey.toString(), farmInfo, {
        prefix: `${platformId}/farm`,
        networkId: NetworkId.solana,
      })
    );
  }

  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-farms`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
