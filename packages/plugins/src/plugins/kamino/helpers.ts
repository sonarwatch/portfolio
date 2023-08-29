import BigNumber from 'bignumber.js';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';
import { Position, Whirlpool } from '../orca/structs/whirlpool';
import { PersonalPositionState, PoolState } from '../raydium/structs/clmms';
import { WhirlpoolPosition } from './structs';

const dexes = ['ORCA', 'RAYDIUM', 'CREMA'];

export function dexToNumber(dex: string) {
  for (let i = 0; i < dexes.length; i += 1) {
    if (dexes[i] === dex) {
      return i;
    }
  }
  throw new Error(`Unknown DEX ${dex}`);
}

export function getTokenAmountsFromInfos(
  strategy: WhirlpoolPosition,
  pool: PoolState | Whirlpool,
  position: PersonalPositionState | Position
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  if (strategy.strategyDex.toNumber() === dexToNumber('ORCA')) {
    const orcaPool = pool as Whirlpool;
    const orcaPosition = position as Position;
    return getTokenAmountsFromLiquidity(
      orcaPool.liquidity,
      orcaPool.tickCurrentIndex,
      orcaPosition.tickLowerIndex,
      orcaPosition.tickUpperIndex,
      1
    );
  }
  if (strategy.strategyDex.toNumber() === dexToNumber('RAYDIUM')) {
    const orcaPool = pool as PoolState;
    const orcaPosition = position as PersonalPositionState;
    return getTokenAmountsFromLiquidity(
      orcaPool.liquidity,
      orcaPool.tickCurrent,
      orcaPosition.tickLowerIndex,
      orcaPosition.tickUpperIndex,
      1
    );
  }
  throw new Error(`Invalid dex ${strategy.strategyDex.toString()}`);
}
