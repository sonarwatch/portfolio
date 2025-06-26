import { PublicKey } from '@solana/web3.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { fluxbeamPoolsPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  mintAccountStruct,
  tokenAccountStruct,
} from '../../utils/solana';
import { poolStruct } from './structs';
import { getLpTokenSourceRaw } from '../../utils/misc/getLpTokenSourceRaw';
import {
  Decimal,
  getCachedDecimalsForToken,
} from '../../utils/misc/getCachedDecimalsForToken';
import sleep from '../../utils/misc/sleep';
import { getParsedMultipleAccountsInfoSafe } from '../../utils/solana/getParsedMultipleAccountsInfoSafe';

const tokenAccountsToExclude = [
  'F5LQTC4G9kBsMKsXtHgf9RqR15k3JB8K3smR73VB9pzY',
  '3zAvJPHBX42kc1htJc6RFihhpnQxP5KqpqqkrTEUhZ9S',
  '4xLaHwEgqPX6JGeNSK8T56RTCGd5oqdUrc4Rq3WvBdCA'
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

  await sleep(5000);

  const step = 100;
  const sources = [];
  for (let offset = 0; offset < allPoolsPubkeys.length; offset += step) {
    const tempTokenAccountsMap: Map<
      string,
      ParsedAccount<TokenAccount>
    > = new Map();
    const tempTokenMints: PublicKey[] = [];
    const tempTokenAddresses: Set<string> = new Set();
    const tempsReserveAccounts: PublicKey[] = [];
    const tempsPoolMints: PublicKey[] = [];

    const tempPools = await getParsedMultipleAccountsInfoSafe(
      connection,
      poolStruct,
      poolStruct.byteSize,
      allPoolsPubkeys.slice(offset, offset + step).map((res) => res.pubkey)
    );

    tempPools.forEach((pool) => {
      if (pool && pool.isInitialized) {
        tempTokenMints.push(...[pool.tokenAMint, pool.tokenBMint]);
        tempTokenAddresses.add(pool.tokenAMint.toString());
        tempTokenAddresses.add(pool.tokenBMint.toString());
        tempsReserveAccounts.push(...[pool.tokenA, pool.tokenB]);
        tempsPoolMints.push(...[pool.poolMint]);
      }
    });

    const tokenPrices = await cache.getTokenPricesAsMap(
      tempTokenAddresses,
      NetworkId.solana
    );

    const tokensMissingDecimals = Array.from(tempTokenAddresses).filter(
      (t) => !tokenPrices.get(t) && !tokenAccountsToExclude.includes(t)
    );

    const missingDecimals = await Promise.all(
      tokensMissingDecimals.map((t) =>
        getCachedDecimalsForToken(cache, t, NetworkId.solana)
      )
    );

    const decimalsByMissingToken: Map<string, Decimal> = new Map();
    missingDecimals.forEach((d, index) => {
      decimalsByMissingToken.set(tokensMissingDecimals[index], d);
    });

    const [tokenAccounts, poolMintsAccounts, tokenPriceById] =
      await Promise.all([
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
        cache.getTokenPricesAsMap(tempTokenAddresses, NetworkId.solana),
      ]);

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

      const decimalA =
        tokenPriceById.get(pool.tokenAMint.toString())?.decimals ||
        decimalsByMissingToken.get(pool.tokenAMint.toString());

      const decimalB =
        tokenPriceById.get(pool.tokenBMint.toString())?.decimals ||
        decimalsByMissingToken.get(pool.tokenBMint.toString());
      if (!decimalA || !decimalB) continue;

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
            decimals: decimalA,
            reserveAmountRaw: tokenAccountA.amount,
            tokenPrice: tokenPriceA,
            weight: 0.5,
          },
          {
            address: pool.tokenBMint.toString(),
            decimals: decimalB,
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
  labels: [NetworkId.solana, 'slow'],
};
export default job;
