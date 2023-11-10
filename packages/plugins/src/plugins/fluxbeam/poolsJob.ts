import { PublicKey } from '@solana/web3.js';
import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { fluxbeamPoolsPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { poolStruct } from './structs';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  const pools = await getParsedProgramAccounts(
    connection,
    poolStruct,
    new PublicKey(fluxbeamPoolsPid),
    [{ dataSize: poolStruct.byteSize }]
  );
  const tokenAccountsAddresses = pools
    .map((pool) => [pool.tokenA, pool.tokenB])
    .flat();
  const tokenAccounts = await getParsedMultipleAccountsInfo(
    connection,
    tokenAccountStruct,
    tokenAccountsAddresses
  );
  const tokenAccountsMap: Map<string, ParsedAccount<TokenAccount>> = new Map();
  tokenAccounts.forEach((tokenAccount) => {
    if (!tokenAccount) return;
    tokenAccountsMap.set(tokenAccount.pubkey.toString(), tokenAccount);
  });

  const poolMints = await getParsedMultipleAccountsInfo(
    connection,
    mintAccountStruct,
    pools.map((p) => p.poolMint)
  );

  const tokenMintsAddresses = pools
    .map((pool) => [pool.tokenAMint.toString(), pool.tokenBMint.toString()])
    .flat();

  const tokenPriceResults = await cache.getTokenPrices(
    tokenMintsAddresses,
    NetworkId.solana
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((tokenPrice) => {
    if (!tokenPrice) return;
    tokenPrices.set(tokenPrice.address, tokenPrice);
  });

  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];
    if (!pool.isInitialized) continue;
    const poolMint = poolMints[i];
    if (!poolMint) continue;

    const tokenPriceA = tokenPrices.get(pool.tokenAMint.toString());
    const tokenPriceB = tokenPrices.get(pool.tokenBMint.toString());
    if (!tokenPriceA || !tokenPriceB) continue;

    const tokenAccountA = tokenAccountsMap.get(pool.tokenA.toString());
    const tokenAccountB = tokenAccountsMap.get(pool.tokenB.toString());
    if (!tokenAccountA || !tokenAccountB) continue;

    const source = getLpTokenSourceRaw(
      NetworkId.solana,
      platformId,
      platformId,
      'Pools',
      {
        address: pool.poolMint.toString(),
        decimals: poolMint.decimals,
        supplyRaw: poolMint.supply,
      },
      [
        {
          address: tokenPriceA.address,
          decimals: tokenPriceA.decimals,
          price: tokenPriceA.price,
          reserveAmountRaw: tokenAccountA.amount,
        },
        {
          address: tokenPriceB.address,
          decimals: tokenPriceB.decimals,
          price: tokenPriceB.price,
          reserveAmountRaw: tokenAccountB.amount,
        },
      ]
    );
    await cache.setTokenPriceSource(source);
  }
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
