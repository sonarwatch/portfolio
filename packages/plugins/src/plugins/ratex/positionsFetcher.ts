import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { platformId, programsCacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Program } from './types';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import {
  getLpDatasByProgram,
  getPools,
  getUsersByProgram,
  getUserStatsByProgram,
} from './helpers';
import { sqrtPriceX64ToPrice } from '../../utils/clmm/tokenPricesFromSqrt';

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

  programs.forEach((program) => {
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
      lpDatas.forEach((lpData) => {
        if (!lpData) return;
        const ammpool = pools.get(lpData.ammPosition.ammpool.toString());
        if (!ammpool) return;

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
        const quoteAssetAmount = new BigNumber(lpData.reserveQuoteAmount).plus(
          tokenAmountB
        );
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
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
