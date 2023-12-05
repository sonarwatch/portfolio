import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { platformId, whirlpoolPrefix, whirlpoolProgram } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { whirlpoolStruct } from './structs/whirlpool';
import { whirlpoolFilters } from './filters';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import storeTokenPricesFromSqrt from '../../utils/clmm/tokenPricesFromSqrt';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const whirlpoolsInfo = await getParsedProgramAccounts(
    client,
    whirlpoolStruct,
    whirlpoolProgram,
    whirlpoolFilters
  );

  const promises = [];
  for (let id = 0; id < whirlpoolsInfo.length; id++) {
    const whirlpoolInfo = whirlpoolsInfo[id];
    if (whirlpoolInfo.liquidity.isZero()) continue;

    const reserveX = await client.getBalance(whirlpoolInfo.tokenVaultA);
    const reserveY = await client.getBalance(whirlpoolInfo.tokenVaultB);
    promises.push(
      storeTokenPricesFromSqrt(
        cache,
        NetworkId.solana,
        whirlpoolInfo.pubkey.toString(),
        new BigNumber(reserveX),
        new BigNumber(reserveY),
        whirlpoolInfo.sqrtPrice,
        whirlpoolInfo.tokenMintA.toString(),
        whirlpoolInfo.tokenMintB.toString()
      )
    );

    promises.push(
      cache.setItem(whirlpoolInfo.pubkey.toString(), whirlpoolInfo, {
        prefix: whirlpoolPrefix,
        networkId: NetworkId.solana,
      })
    );
  }

  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-whirlpools`,
  executor,
};
export default job;
