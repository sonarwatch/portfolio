import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { platformId, poolStatesPrefix, raydiumProgram } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';
import { poolStateStruct } from './structs/clmms';
import { clmmPoolsStateFilter } from './filters';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const clmmPoolsInfo = await getParsedProgramAccounts(
    client,
    poolStateStruct,
    raydiumProgram,
    clmmPoolsStateFilter
  );

  const promises = [];
  for (let id = 0; id < clmmPoolsInfo.length; id++) {
    const poolState = clmmPoolsInfo[id];
    if (poolState.liquidity.isZero()) continue;

    const reserve0 = await client.getBalance(poolState.tokenVault0);
    const reserve1 = await client.getBalance(poolState.tokenVault1);
    promises.push(
      storeTokenPricesFromSqrt(
        cache,
        NetworkId.solana,
        poolState.pubkey.toString(),
        new BigNumber(reserve0),
        new BigNumber(reserve1),
        poolState.sqrtPriceX64,
        poolState.tokenMint0.toString(),
        poolState.tokenMint1.toString()
      )
    );

    promises.push(
      cache.setItem(poolState.pubkey.toString(), poolState, {
        prefix: poolStatesPrefix,
        networkId: NetworkId.solana,
      })
    );
  }
  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-clmm`,
  executor,
  label: 'normal',
};
export default job;
