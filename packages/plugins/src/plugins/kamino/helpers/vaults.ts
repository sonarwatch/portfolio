import BigNumber from 'bignumber.js';
import { BeetStruct } from '@metaplex-foundation/beet';
import {
  Position,
  Whirlpool,
  positionStruct,
  whirlpoolStruct,
} from '../../orca/structs/whirlpool';
import {
  PersonalPositionState,
  PoolState,
  personalPositionStateStruct,
  poolStateStruct,
} from '../../raydium/structs/clmms';
import { WhirlpoolStrategy } from '../structs/vaults';
import { ParsedAccount } from '../../../utils/solana';
import { getTokenAmountsFromLiquidity } from '../../../utils/clmm/tokenAmountFromLiquidity';
import {
  BinArray,
  DLMMPosition,
  LbPair,
  dlmmPositionV2Struct,
  lbPairStruct,
} from '../../meteora/dlmm/structs';
import { getTokensAmountsFromLiquidity } from '../../meteora/dlmm/dlmmHelper';

export enum DEXS {
  ORCA,
  RAYDIUM,
  METEORA,
}

export function getTokenAmountsFromInfos(
  strategy: ParsedAccount<WhirlpoolStrategy>,
  pool: PoolState | Whirlpool | LbPair,
  position: PersonalPositionState | Position | DLMMPosition,
  binArrays?: BinArray[]
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  if (strategy.strategyDex.toNumber() === DEXS.ORCA) {
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
  if (strategy.strategyDex.toNumber() === DEXS.RAYDIUM) {
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
  if (strategy.strategyDex.toNumber() === DEXS.METEORA) {
    const meteoraPool = pool as LbPair;
    const meteoraPosition = position as DLMMPosition;

    if (binArrays && binArrays.length === 2) {
      return getTokensAmountsFromLiquidity(
        meteoraPosition,
        meteoraPool,
        binArrays?.[0],
        binArrays?.[1],
        strategy.tokenAMintDecimals.toNumber(),
        strategy.tokenBMintDecimals.toNumber()
      );
    }
  }
  return { tokenAmountA: new BigNumber(0), tokenAmountB: new BigNumber(0) };
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

type PoolStruct =
  | BeetStruct<PoolState, Partial<PoolState>>
  | BeetStruct<Whirlpool, Partial<Whirlpool>>
  | BeetStruct<LbPair, Partial<LbPair>>;

export function getPoolStructFromDex(
  dexNumber: BigNumber
): PoolStruct | undefined {
  if (dexNumber.toNumber() === DEXS.ORCA) return whirlpoolStruct;
  if (dexNumber.toNumber() === DEXS.RAYDIUM) return poolStateStruct;
  if (dexNumber.toNumber() === DEXS.METEORA) return lbPairStruct;
  return undefined;
}

type PositionStruct =
  | BeetStruct<PersonalPositionState, Partial<PersonalPositionState>>
  | BeetStruct<Position, Partial<Position>>
  | BeetStruct<DLMMPosition, Partial<DLMMPosition>>;

export function getPositionStructFromDex(
  dexNumber: BigNumber
): PositionStruct | undefined {
  if (dexNumber.toNumber() === DEXS.ORCA) return positionStruct;
  if (dexNumber.toNumber() === DEXS.RAYDIUM) return personalPositionStateStruct;
  if (dexNumber.toNumber() === DEXS.METEORA) return dlmmPositionV2Struct;
  return undefined;
}
