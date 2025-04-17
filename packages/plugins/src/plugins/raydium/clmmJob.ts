import {
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { platformId, raydiumProgram } from './constants';
import {
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import { sqrtPriceX64ToPrice } from '../../utils/clmm/tokenPricesFromSqrt';
import { PoolState, poolStateStruct } from './structs/clmms';
import { clmmPoolsStateFilter } from './filters';
import { defaultAcceptedPairs } from '../../utils/misc/getLpUnderlyingTokenSource';
import { minimumReserveValue } from '../../utils/misc/constants';
import getSourceWeight from '../../utils/misc/getSourceWeight';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const allPoolsPubkeys = await client.getProgramAccounts(raydiumProgram, {
    filters: clmmPoolsStateFilter,
    dataSlice: { offset: 0, length: 0 },
  });

  const acceptedPairs = defaultAcceptedPairs.get(NetworkId.solana);
  if (!acceptedPairs) return;

  const step = 100;
  const tokenPriceSources: TokenPriceSource[] = [];
  let clmmPoolsInfo: (ParsedAccount<PoolState> | null)[];
  let tokenAccounts;
  let tokenPriceById;
  for (let offset = 0; offset < allPoolsPubkeys.length; offset += step) {
    const tokenAccountsPkeys: PublicKey[] = [];
    const mints: Set<string> = new Set();

    clmmPoolsInfo = await getParsedMultipleAccountsInfo(
      client,
      poolStateStruct,
      allPoolsPubkeys.slice(offset, offset + step).map((res) => res.pubkey)
    );

    clmmPoolsInfo.forEach((pI) => {
      if (!pI) return;
      mints.add(pI.tokenMint0.toString());
      mints.add(pI.tokenMint1.toString());
      tokenAccountsPkeys.push(pI.tokenVault0, pI.tokenVault1);
    });

    [tokenAccounts, tokenPriceById] = await Promise.all([
      getParsedMultipleAccountsInfo(
        client,
        tokenAccountStruct,
        tokenAccountsPkeys
      ),
      cache.getTokenPricesAsMap(Array.from(mints), NetworkId.solana),
    ]);

    const tokenAccountsMap: Map<string, TokenAccount> = new Map();
    tokenAccounts.forEach((tA) => {
      if (!tA) return;
      tokenAccountsMap.set(tA.pubkey.toString(), tA);
    });

    let mintA;
    let mintB;
    let unknownPrice;
    let decimalA;
    let decimalB;
    let poolState;
    let refLiquidity;
    let priceAToB;
    let refTokenPrice;
    let refTokenAccount;
    for (let id = 0; id < clmmPoolsInfo.length; id++) {
      poolState = clmmPoolsInfo[id];
      if (!poolState || poolState.liquidity.isZero()) continue;

      mintA = poolState.tokenMint0.toString();
      mintB = poolState.tokenMint1.toString();
      decimalA = poolState.mintDecimals0;
      decimalB = poolState.mintDecimals1;

      let refMint;
      let unkMint: string;
      let refTokenVault: string;
      let aToB: boolean;
      let refDecimal;
      let unkDecimal: number;
      if (acceptedPairs.includes(mintA)) {
        refMint = mintA;
        unkMint = mintB;
        refTokenVault = poolState.tokenVault0.toString();
        aToB = true;
        refDecimal = decimalA;
        unkDecimal = decimalB;
      } else if (acceptedPairs.includes(mintB)) {
        refMint = mintB;
        unkMint = mintA;
        refTokenVault = poolState.tokenVault1.toString();
        aToB = false;
        refDecimal = decimalB;
        unkDecimal = decimalA;
      } else {
        continue;
      }

      refTokenPrice = tokenPriceById.get(refMint);
      if (!refTokenPrice) continue;

      refTokenAccount = tokenAccountsMap.get(refTokenVault);
      if (!refTokenAccount) continue;

      refLiquidity = refTokenAccount.amount
        .times(refTokenPrice.price)
        .dividedBy(10 ** refDecimal);
      if (refLiquidity.isLessThan(minimumReserveValue)) continue;

      priceAToB = sqrtPriceX64ToPrice(
        poolState.sqrtPriceX64,
        decimalA,
        decimalB
      );

      unknownPrice = aToB
        ? new Decimal(refTokenPrice.price).dividedBy(priceAToB).toNumber()
        : new Decimal(refTokenPrice.price).times(priceAToB).toNumber();

      tokenPriceSources.push({
        address: unkMint,
        decimals: unkDecimal,
        id: platformId,
        networkId: NetworkId.solana,
        platformId: walletTokensPlatformId,
        price: unknownPrice,
        timestamp: Date.now(),
        weight: getSourceWeight(refLiquidity.times(2)),
      });
    }

    await cache.setTokenPriceSources(tokenPriceSources);
  }
};

const job: Job = {
  id: `${platformId}-clmm`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
