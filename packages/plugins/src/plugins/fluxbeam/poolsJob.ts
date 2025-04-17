import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { fluxbeamPoolsPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  MintAccount,
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { Pool, poolStruct } from './structs';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';

const tokenAccountsToExclude = [
  'F5LQTC4G9kBsMKsXtHgf9RqR15k3JB8K3smR73VB9pzY',
  '3zAvJPHBX42kc1htJc6RFihhpnQxP5KqpqqkrTEUhZ9S',
];

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const allPoolsPubkeys = await connection.getProgramAccounts(
    new PublicKey(fluxbeamPoolsPid),
    {
      filters: [{ dataSize: poolStruct.byteSize }],
      dataSlice: { length: 0, offset: 0 },
    }
  );

  const step = 100;
  let tempPools: (ParsedAccount<Pool> | null)[];
  const sources = [];
  for (let offset = 0; offset < allPoolsPubkeys.length; offset += step) {
    const tempTokenAccountsMap: Map<
      string,
      ParsedAccount<TokenAccount>
    > = new Map();
    const tempTokenMintsAccountsMap: Map<
      string,
      ParsedAccount<MintAccount>
    > = new Map();
    const tempTokenMints: PublicKey[] = [];
    const tempTokenAddresses: Set<string> = new Set();
    const tempsReserveAccounts: PublicKey[] = [];
    const tempsPoolMints: PublicKey[] = [];
    tempPools = await getParsedMultipleAccountsInfo(
      connection,
      poolStruct,
      allPoolsPubkeys.slice(offset, offset + step).map((res) => res.pubkey)
    );
    tempPools = tempPools.filter((pool) => pool?.isInitialized);

    tempPools.forEach((pool) => {
      if (pool) {
        tempTokenMints.push(...[pool.tokenAMint, pool.tokenBMint]);
        tempTokenAddresses.add(pool.tokenAMint.toString());
        tempTokenAddresses.add(pool.tokenBMint.toString());
        tempsReserveAccounts.push(...[pool.tokenA, pool.tokenB]);
        tempsPoolMints.push(...[pool.poolMint]);
      }
    });
    const [
      tokenAccounts,
      poolMintsAccounts,
      tokenMintsAccounts,
      tokenPriceById,
    ] = await Promise.all([
      getParsedMultipleAccountsInfo(
        connection,
        tokenAccountStruct,
        tempsReserveAccounts
      ),
      getParsedMultipleAccountsInfo(
        connection,
        mintAccountStruct,
        tempsPoolMints
      ),
      getParsedMultipleAccountsInfo(
        connection,
        mintAccountStruct,
        Array.from(tempTokenAddresses)
          .map((t) => {
            if (!tokenAccountsToExclude.includes(t)) {
              return new PublicKey(t);
            }
            return [];
          })
          .flat()
      ),
      cache.getTokenPricesAsMap(tempTokenAddresses, NetworkId.solana),
    ]);

    if (!tokenMintsAccounts) continue;

    tokenMintsAccounts.forEach((tokenMintAccount) => {
      if (!tokenMintAccount) return;
      tempTokenMintsAccountsMap.set(
        tokenMintAccount.pubkey.toString(),
        tokenMintAccount
      );
    });

    tokenAccounts.forEach((tokenAccount) => {
      if (!tokenAccount) return;
      tempTokenAccountsMap.set(tokenAccount.pubkey.toString(), tokenAccount);
    });

    for (let i = 0; i < tempPools.length; i++) {
      const pool = tempPools[i];
      if (!pool || !pool.isInitialized) continue;

      const poolMint = poolMintsAccounts[i];
      if (!poolMint) continue;

      const tokenAccountA = tempTokenAccountsMap.get(pool.tokenA.toString());
      const tokenAccountB = tempTokenAccountsMap.get(pool.tokenB.toString());
      if (!tokenAccountA || !tokenAccountB) continue;
      const mintAccountA = tempTokenMintsAccountsMap.get(
        pool.tokenAMint.toString()
      );
      const mintAccountB = tempTokenMintsAccountsMap.get(
        pool.tokenBMint.toString()
      );
      if (!mintAccountA || !mintAccountB) continue;
      const tokenPriceA = tokenPriceById.get(pool.tokenAMint.toString());
      const tokenPriceB = tokenPriceById.get(pool.tokenBMint.toString());

      const lpSources = getLpTokenSourceRaw({
        lpDetails: {
          address: pool.poolMint.toString(),
          decimals: poolMint.decimals,
          supplyRaw: poolMint.supply,
        },
        platformId,
        sourceId: pool.pubkey.toString(),
        networkId: NetworkId.solana,
        poolUnderlyingsRaw: [
          {
            address: pool.tokenAMint.toString(),
            decimals: mintAccountA.decimals,
            reserveAmountRaw: tokenAccountA.amount,
            tokenPrice: tokenPriceA,
            weight: 0.5,
          },
          {
            address: pool.tokenBMint.toString(),
            decimals: mintAccountB.decimals,
            reserveAmountRaw: tokenAccountB.amount,
            tokenPrice: tokenPriceB,
            weight: 0.5,
          },
        ],
        priceUnderlyings: true,
      });

      sources.push(...lpSources);
    }
  }

  await cache.setTokenPriceSources(sources);
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
