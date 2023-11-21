import BigNumber from 'bignumber.js';
import { Position, Whirlpool } from '../../orca/structs/whirlpool';
import { PersonalPositionState, PoolState } from '../../raydium/structs/clmms';
import { WhirlpoolStrategy } from '../structs/vaults';
import { ParsedAccount } from '../../../utils/solana';
import { getTokenAmountsFromLiquidity } from '../../../utils/clmm/tokenAmountFromLiquidity';

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
  strategy: ParsedAccount<WhirlpoolStrategy>,
  pool: PoolState | Whirlpool,
  position: PersonalPositionState | Position
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  if (strategy.strategyDex.toNumber() === dexToNumber('ORCA')) {
    const orcaPool = pool as Whirlpool;
    const orcaPosition = position as Position;

    return getTokenAmountsFromLiquidity(
      orcaPosition.liquidity,
      orcaPool.tickCurrentIndex,
      orcaPosition.tickLowerIndex,
      orcaPosition.tickUpperIndex,
      false
    );
  }
  if (strategy.strategyDex.toNumber() === dexToNumber('RAYDIUM')) {
    const raydiumPool = pool as PoolState;
    const raydiumPosition = position as PersonalPositionState;

    return getTokenAmountsFromLiquidity(
      raydiumPosition.liquidity,
      raydiumPool.tickCurrent,
      raydiumPosition.tickLowerIndex,
      raydiumPosition.tickUpperIndex,
      false
    );
  }
  throw new Error(`Invalid dex ${strategy.strategyDex.toString()}`);
}

const statusByNum = new Map([
  [0, 'IGNORED'],
  [1, 'SHADOW'],
  [2, 'LIVE'],
  [3, 'DEPRECATED'],
  [4, 'STAGING'],
]);

export function isActive(strategy: WhirlpoolStrategy): boolean {
  if (strategy.sharesIssued.isZero()) return false;
  const status = statusByNum.get(strategy.status.toNumber());
  if (!status) return false;
  if (status === 'IGNORED' || status === 'STAGING') return false;
  return true;
}
