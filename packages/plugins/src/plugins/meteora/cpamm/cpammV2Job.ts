import { NetworkId, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSolana } from '../../../utils/clients';
import { ParsedGpa } from '../../../utils/solana/beets/ParsedGpa';
import { cpammProgramId, platformId } from '../constants';
import { Rounding } from '../dlmm/dlmmHelper';
import {
  getAmountAFromLiquidityDelta,
  getAmountBFromLiquidityDelta,
} from './helpers';
import { poolStruct } from './structs';
import { getLpUnderlyingTokenSource } from '../../../utils/misc/getLpUnderlyingTokenSource';
import { getDecimalsForToken } from '../../../utils/misc/getDecimalsForToken';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();

  const poolsAccounts = await ParsedGpa.build(
    client,
    poolStruct,
    cpammProgramId
  )
    .addFilter('discriminator', [241, 154, 109, 4, 17, 177, 109, 188])
    .addDataSizeFilter(1112)
    .run();

  const vaultAccounts: PublicKey[] = [];
  const mints: Set<string> = new Set();
  const tokensA: string[] = [];
  const tokensB: string[] = [];
  poolsAccounts.forEach((poolAccount) => {
    vaultAccounts.push(poolAccount.tokenAVault, poolAccount.tokenBVault);
    mints.add(poolAccount.tokenAMint.toString());
    mints.add(poolAccount.tokenBMint.toString());
    tokensA.push(poolAccount.tokenAMint.toString());
    tokensB.push(poolAccount.tokenBMint.toString());
  });

  const decimalsA = await Promise.all([
    ...tokensA.map((m) => getDecimalsForToken(m, NetworkId.solana)),
  ]);
  const decimalsB = await Promise.all([
    ...tokensB.map((m) => getDecimalsForToken(m, NetworkId.solana)),
  ]);

  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.solana);

  const sources: TokenPriceSource[] = [];
  poolsAccounts.forEach((poolAccount, index) => {
    const tokenPriceA = tokenPrices.get(poolAccount.tokenAMint.toString());
    const tokenPriceB = tokenPrices.get(poolAccount.tokenBMint.toString());

    const decimalA = decimalsA[index];
    const decimalB = decimalsB[index];

    const amountA = getAmountAFromLiquidityDelta(
      poolAccount.liquidity,
      poolAccount.sqrtPrice,
      poolAccount.sqrtMaxPrice,
      Rounding.Down
    );

    const amountB = getAmountBFromLiquidityDelta(
      poolAccount.liquidity,
      poolAccount.sqrtPrice,
      poolAccount.sqrtMinPrice,
      Rounding.Down
    );

    const underlyingSources = getLpUnderlyingTokenSource({
      networkId: NetworkId.solana,
      sourceId: poolAccount.pubkey.toString(),
      poolUnderlyings: [
        {
          address: poolAccount.tokenAMint.toString(),
          decimals: Number(decimalA),
          reserveAmount: amountA.dividedBy(10 ** Number(decimalA)).toNumber(),
          weight: 0.5,
          tokenPrice: tokenPriceA,
        },
        {
          address: poolAccount.tokenBMint.toString(),
          decimals: Number(decimalB),
          reserveAmount: amountB.dividedBy(10 ** Number(decimalB)).toNumber(),
          weight: 0.5,
          tokenPrice: tokenPriceB,
        },
      ],
    });
    sources.push(...underlyingSources);
  });
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-cpamm-pools`,
  executor,
  networkIds: [NetworkId.solana],
  labels: ['normal'],
};
export default job;
