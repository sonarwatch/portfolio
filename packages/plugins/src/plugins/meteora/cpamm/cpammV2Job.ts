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
import {
  Decimal,
  getCachedDecimalsForToken,
} from '../../../utils/misc/getCachedDecimalsForToken';

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

  const step = 500;
  const sources: TokenPriceSource[] = [];
  for (let i = 0; i < poolsAccounts.length; i += step) {
    const vaultAccounts: PublicKey[] = [];
    const mints: Set<string> = new Set();
    const tokensA: string[] = [];
    const tokensB: string[] = [];
    const subPoolAccounts = poolsAccounts.slice(i, i + step);

    subPoolAccounts.forEach((poolAccount) => {
      vaultAccounts.push(poolAccount.tokenAVault, poolAccount.tokenBVault);
      mints.add(poolAccount.tokenAMint.toString());
      mints.add(poolAccount.tokenBMint.toString());
      tokensA.push(poolAccount.tokenAMint.toString());
      tokensB.push(poolAccount.tokenBMint.toString());
    });

    const tokenPrices = await cache.getTokenPricesAsMap(
      mints,
      NetworkId.solana
    );

    const tokensMissingDecimals = [
      ...tokensA.filter((t) => !tokenPrices.get(t)),
      ...tokensB.filter((t) => !tokenPrices.get(t)),
    ];

    const missingDecimals = await Promise.all([
      ...tokensMissingDecimals.map((t) =>
        getCachedDecimalsForToken(cache, t, NetworkId.solana)
      ),
    ]);

    const decimalsByMissingToken: Map<string, Decimal> = new Map();
    missingDecimals.forEach((d, index) => {
      decimalsByMissingToken.set(tokensMissingDecimals[index], d);
    });

    subPoolAccounts.forEach((poolAccount) => {
      const tokenPriceA = tokenPrices.get(poolAccount.tokenAMint.toString());
      const tokenPriceB = tokenPrices.get(poolAccount.tokenBMint.toString());

      const decimalA =
        tokenPriceA?.decimals ||
        decimalsByMissingToken.get(poolAccount.tokenAMint.toString());
      const decimalB =
        tokenPriceB?.decimals ||
        decimalsByMissingToken.get(poolAccount.tokenBMint.toString());

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
  }
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-cpamm-pools`,
  executor,
  networkIds: [NetworkId.solana],
  labels: ['normal'],
};
export default job;
