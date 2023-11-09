import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  NetworkId,
  TokenPrice,
  TokenPriceSource,
} from '@sonarwatch/portfolio-core';
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
  // const tokenMints = await getParsedMultipleAccountsInfo(
  //   connection,
  //   mintAccountStruct,
  //   tokenMintsAddresses
  // );
  // const tokenMintsMap: Map<string, ParsedAccount<MintAccount>> = new Map();
  // tokenMints.forEach((tokenMint) => {
  //   if (!tokenMint) return;
  //   tokenMintsMap.set(tokenMint.pubkey.toString(), tokenMint);
  // });

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

    const amountA = new BigNumber(tokenAccountA.amount.toString())
      .div(10 ** tokenPriceA.decimals)
      .toNumber();
    const amountB = new BigNumber(tokenAccountB.amount.toString())
      .div(10 ** tokenPriceB.decimals)
      .toNumber();
    const lpSupply = new BigNumber(poolMint.supply)
      .div(10 ** poolMint.decimals)
      .toNumber();
    const price =
      (amountA * tokenPriceA.price + amountB * tokenPriceB.price) / lpSupply;

    const source: TokenPriceSource = {
      networkId: NetworkId.solana,
      elementName: 'Pools',
      platformId,
      id: platformId,
      weight: 1,
      address: pool.poolMint.toString(),
      price,
      decimals: poolMint.decimals,
      underlyings: [
        {
          networkId: NetworkId.solana,
          address: tokenPriceA.address.toString(),
          decimals: tokenPriceA.decimals,
          price: tokenPriceA.price,
          amountPerLp: amountA / lpSupply,
        },
        {
          networkId: NetworkId.solana,
          address: tokenPriceB.address.toString(),
          decimals: tokenPriceB.decimals,
          price: tokenPriceB.price,
          amountPerLp: amountB / lpSupply,
        },
      ],
      timestamp: Date.now(),
    };
    await cache.setTokenPriceSource(source);
  }
};
const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
