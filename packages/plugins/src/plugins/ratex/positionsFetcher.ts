import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId, programsCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Program } from './types';
import {
  getTokenAmountFromSqrtPrice,
  getTokenAmountsFromLiquidity,
} from '../../utils/clmm/tokenAmountFromLiquidity';
import {
  getLpDatasByProgram,
  getPools,
  getUsersByProgram,
  getUserStatsByProgram,
} from './helpers';
import { sqrtPriceX64ToPrice } from '../../utils/clmm/tokenPricesFromSqrt';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getClientSolana } from '../../utils/clients';
import { unifiedPositionStruct } from './structs';

const programsMemo = new MemoizedCache<Program[]>(programsCacheKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const programs = await programsMemo.getItem(cache);
  if (!programs) throw new Error('No programs cached.');

  const userStatsByProgram = await getUserStatsByProgram(programs, owner);

  const [usersByProgram, lpDatasByProgram] = await Promise.all([
    getUsersByProgram(programs, userStatsByProgram, owner),
    getLpDatasByProgram(programs, userStatsByProgram, owner),
  ]);

  const pools = await getPools(programs, lpDatasByProgram, cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (const program of programs) {
    const users = usersByProgram.get(program.programId);

    if (users) {
      users.forEach((user) => {
        if (!user) return;
        user.marginPositions.forEach((marginPosition) => {
          if (!marginPosition.balance.isZero()) {
            const element = elementRegistry.addElementMultiple({
              label: 'Margin',
              link: 'https://app.rate-x.io/trade',
              ref: user.pubkey,
            });
            element.addAsset({
              address: program.mint,
              amount: marginPosition.balance,
            });
          }
        });
      });
    }

    const lpDatas = lpDatasByProgram.get(program.programId);
    if (lpDatas) {
      for (const lpData of lpDatas) {
        if (!lpData) continue;
        const ammPoolAddress =
          'ammPosition' in lpData ? lpData.ammPosition.ammpool : lpData.ammpool;
        const ammpool = pools.get(ammPoolAddress.toString());
        if (!ammpool) continue;

        if (program.version === 1 && 'ammPosition' in lpData) {
          const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
            new BigNumber(lpData.ammPosition.liquidity),
            ammpool.pool.tickCurrentIndex,
            lpData.ammPosition.tickLowerIndex,
            lpData.ammPosition.tickUpperIndex,
            true
          );

          const baseAssetAmount = new BigNumber(lpData.reserveBaseAmount).plus(
            tokenAmountA
          );
          const quoteAssetAmount = new BigNumber(
            lpData.reserveQuoteAmount
          ).plus(tokenAmountB);
          const o = sqrtPriceX64ToPrice(
            new BigNumber(ammpool.pool.sqrtPrice),
            9,
            9
          );

          const element = elementRegistry.addElementMultiple({
            label: 'LiquidityPool',
            link: 'https://app.rate-x.io/liquidity',
            ref: lpData.pubkey,
            sourceRefs: [
              {
                name: 'Pool',
                address: ammpool.pubkey.toString(),
              },
            ],
          });
          element.addAsset({
            address: program.mint,
            amount: baseAssetAmount
              .times(o.toString())
              .plus(quoteAssetAmount)
              .dividedBy(ammpool.rate),
            alreadyShifted: true,
          });
        } else if (program.version === 2 && 'position' in lpData) {
          const unifiedPositionData = await getParsedAccountInfo(
            getClientSolana(),
            unifiedPositionStruct,
            lpData.position
          );
          if (!unifiedPositionData) continue;

          const curLpLiquidity = lpData.lastLiquidity
            .multipliedBy(unifiedPositionData.ratio)
            .dividedBy(lpData.lastRatio)
            .integerValue();

          const reserveBaseEquivalent = lpData.reserveBaseAmount
            .plus(
              curLpLiquidity
                .multipliedBy(unifiedPositionData.settledBaseAmount)
                .dividedBy(ammpool.pool.liquidity)
            )
            .integerValue();

          const rebasedQuote = lpData.reserveQuoteAmount
            .multipliedBy(ammpool.rate)
            .dividedBy(lpData.lastRate)
            .minus(lpData.reserveQuoteAmount)
            .plus(
              lpData.reserveBaseAmount
                .multipliedBy(ammpool.rate)
                .dividedBy(lpData.lastRate)
            )
            .minus(lpData.reserveBaseAmount)
            .times(0.95)
            .integerValue();

          const reserveQuoteEquivalent = lpData.reserveQuoteAmount
            .plus(rebasedQuote)
            .plus(
              curLpLiquidity
                .multipliedBy(unifiedPositionData.settledQuoteAmount)
                .dividedBy(ammpool.pool.liquidity)
            )
            .integerValue();

          const { tokenAmountA, tokenAmountB } = getTokenAmountFromSqrtPrice(
            curLpLiquidity,
            new BigNumber(ammpool.pool.sqrtPrice),
            new BigNumber(
              (1.0001 ** unifiedPositionData.tickLowerIndex) ** 0.5
            ),
            new BigNumber(
              (1.0001 ** unifiedPositionData.tickUpperIndex) ** 0.5
            ),
            true
          );

          const baseAssetAmount = reserveBaseEquivalent.plus(tokenAmountA);
          const quoteAssetAmount = reserveQuoteEquivalent.plus(tokenAmountB);

          const o = sqrtPriceX64ToPrice(
            new BigNumber(ammpool.pool.sqrtPrice),
            9,
            9
          );

          const element = elementRegistry.addElementMultiple({
            label: 'LiquidityPool',
            link: 'https://app.rate-x.io/liquidity',
            ref: lpData.pubkey,
            sourceRefs: [
              {
                name: 'Pool',
                address: ammpool.pubkey.toString(),
              },
            ],
          });

          element.addAsset({
            address: program.mint,
            amount: baseAssetAmount
              .times(o.toString())
              .plus(quoteAssetAmount)
              .dividedBy(ammpool.rate),
            alreadyShifted: true,
          });
        }
      }
    }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
