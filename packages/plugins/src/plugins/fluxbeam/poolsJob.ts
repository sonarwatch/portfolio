import { PublicKey } from '@solana/web3.js';
import { NetworkId, TokenPrice } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { fluxbeamPoolsPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { poolStruct } from './structs';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';
import getLpUnderlyingTokenSource from '../../utils/misc/getLpUnderlyingTokenSource';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();
  let pools = await getParsedProgramAccounts(
    connection,
    poolStruct,
    new PublicKey(fluxbeamPoolsPid),
    [{ dataSize: poolStruct.byteSize }]
  );
  pools = pools.filter((pool) => pool.isInitialized);

  const reserveAccountsAddresses = pools
    .map((pool) => [pool.tokenA, pool.tokenB])
    .flat();
  const tokenAccounts = await getParsedMultipleAccountsInfo(
    connection,
    tokenAccountStruct,
    reserveAccountsAddresses
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

  const tokenMintsAddresses = [
    ...new Set(
      pools
        .map((pool) => [pool.tokenAMint.toString(), pool.tokenBMint.toString()])
        .flat()
    ),
  ];

  const tokenMintsAccounts = await getParsedMultipleAccountsInfo(
    connection,
    mintAccountStruct,
    tokenMintsAddresses.map((a) => new PublicKey(a))
  );
  const tokenMintsAccountsMap: Map<
    string,
    ParsedAccount<MintAccount>
  > = new Map();
  tokenMintsAccounts.forEach((tokenMintAccount) => {
    if (!tokenMintAccount) return;
    tokenMintsAccountsMap.set(
      tokenMintAccount.pubkey.toString(),
      tokenMintAccount
    );
  });

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

    const tokenAccountA = tokenAccountsMap.get(pool.tokenA.toString());
    const tokenAccountB = tokenAccountsMap.get(pool.tokenB.toString());
    if (!tokenAccountA || !tokenAccountB) continue;
    const mintAccountA = tokenMintsAccountsMap.get(pool.tokenAMint.toString());
    const mintAccountB = tokenMintsAccountsMap.get(pool.tokenBMint.toString());
    if (!mintAccountA || !mintAccountB) continue;
    const tokenPriceA = tokenPrices.get(pool.tokenAMint.toString());
    const tokenPriceB = tokenPrices.get(pool.tokenBMint.toString());

    const underlyingsSource = getLpUnderlyingTokenSource(
      pool.poolMint.toString(),
      NetworkId.solana,
      {
        address: pool.tokenAMint.toString(),
        decimals: mintAccountA.decimals,
        reserveAmountRaw: tokenAccountA.amount,
        tokenPrice: tokenPriceA,
      },
      {
        address: pool.tokenBMint.toString(),
        decimals: mintAccountB.decimals,
        reserveAmountRaw: tokenAccountB.amount,
        tokenPrice: tokenPriceB,
      }
    );
    if (underlyingsSource) {
      await cache.setTokenPriceSource(underlyingsSource);
    }

    if (!tokenPriceA || !tokenPriceB) continue;
    const lpSource = getLpTokenSourceRaw(
      NetworkId.solana,
      platformId,
      platformId,
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
      ],
      'Pools'
    );
    await cache.setTokenPriceSource(lpSource);
  }
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
  label: 'normal',
};
export default job;
