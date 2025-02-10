/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import {
  aprToApy,
  PortfolioAssetCollectible,
  TokenPrice,
  Yield,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { AMM_PROGRAM_ID_V3, positionsIdentifier } from './constants';
import { ClmmPoolInfo, ClmmPoolRewardInfo, Tick } from './types';
import { toBN } from '../../utils/misc/toBN';
import {
  PersonalPositionState,
  PoolState,
  TickArrayState,
} from './structs/clmms';
import { ParsedAccount } from '../../utils/solana';
import { PortfolioAssetTokenParams } from '../../utils/elementbuilder/Params';

export function isARaydiumPosition(nft: PortfolioAssetCollectible): boolean {
  return nft.name === positionsIdentifier;
}

const ZERO = new BN(0);
const ONE = new BN(1);
const Q64 = new BN(1).shln(64);
const Q128 = new BN(1).shln(128);
const U64Resolution = 64;
const MaxUint128 = Q128.subn(1);
const MIN_TICK = -307200;
const MAX_TICK = -MIN_TICK;

function signedRightShift(n0: BN, shiftBy: number, bitWidth: number) {
  const twoN0 = n0.toTwos(bitWidth).shrn(shiftBy);
  twoN0.imaskn(bitWidth - shiftBy + 1);
  return twoN0.fromTwos(bitWidth - shiftBy);
}

function mulRightShift(val: BN, mulBy: BN) {
  return signedRightShift(val.mul(mulBy), 64, 256);
}

export function raydiumTickToPriceX64(tick: number) {
  if (!Number.isInteger(tick)) {
    throw new Error('tick must be integer');
  }
  if (tick < MIN_TICK || tick > MAX_TICK) {
    throw new Error('tick must be in MIN_TICK and MAX_TICK');
  }
  const tickAbs = tick < 0 ? tick * -1 : tick;

  let ratio =
    (tickAbs & 0x1) != 0
      ? new BN('18445821805675395072')
      : new BN('18446744073709551616');
  if ((tickAbs & 0x2) != 0) {
    ratio = mulRightShift(ratio, new BN('18444899583751176192'));
  }
  if ((tickAbs & 0x4) != 0) {
    ratio = mulRightShift(ratio, new BN('18443055278223355904'));
  }
  if ((tickAbs & 0x8) != 0) {
    ratio = mulRightShift(ratio, new BN('18439367220385607680'));
  }
  if ((tickAbs & 0x10) != 0) {
    ratio = mulRightShift(ratio, new BN('18431993317065453568'));
  }
  if ((tickAbs & 0x20) != 0) {
    ratio = mulRightShift(ratio, new BN('18417254355718170624'));
  }
  if ((tickAbs & 0x40) != 0) {
    ratio = mulRightShift(ratio, new BN('18387811781193609216'));
  }
  if ((tickAbs & 0x80) != 0) {
    ratio = mulRightShift(ratio, new BN('18329067761203558400'));
  }
  if ((tickAbs & 0x100) != 0) {
    ratio = mulRightShift(ratio, new BN('18212142134806163456'));
  }
  if ((tickAbs & 0x200) != 0) {
    ratio = mulRightShift(ratio, new BN('17980523815641700352'));
  }
  if ((tickAbs & 0x400) != 0) {
    ratio = mulRightShift(ratio, new BN('17526086738831433728'));
  }
  if ((tickAbs & 0x800) != 0) {
    ratio = mulRightShift(ratio, new BN('16651378430235570176'));
  }
  if ((tickAbs & 0x1000) != 0) {
    ratio = mulRightShift(ratio, new BN('15030750278694412288'));
  }
  if ((tickAbs & 0x2000) != 0) {
    ratio = mulRightShift(ratio, new BN('12247334978884435968'));
  }
  if ((tickAbs & 0x4000) != 0) {
    ratio = mulRightShift(ratio, new BN('8131365268886854656'));
  }
  if ((tickAbs & 0x8000) != 0) {
    ratio = mulRightShift(ratio, new BN('3584323654725218816'));
  }
  if ((tickAbs & 0x10000) != 0) {
    ratio = mulRightShift(ratio, new BN('696457651848324352'));
  }
  if ((tickAbs & 0x20000) != 0) {
    ratio = mulRightShift(ratio, new BN('26294789957507116'));
  }
  if ((tickAbs & 0x40000) != 0) {
    ratio = mulRightShift(ratio, new BN('37481735321082'));
  }

  if (tick > 0) ratio = MaxUint128.div(ratio);
  return ratio;
}

function mulDivRoundingUp(a: BN, b: BN, denominator: BN) {
  const numerator = a.mul(b);
  let result = numerator.div(denominator);
  if (!numerator.mod(denominator).eq(ZERO)) {
    result = result.add(ONE);
  }
  return result;
}

function mulDivFloor(a: BN, b: BN, denominator: BN) {
  if (denominator.eq(ZERO)) {
    throw new Error('division by 0');
  }
  return a.mul(b).div(denominator);
}

function wrappingSubU128(n0: BN, n1: BN): BN {
  return n0.add(Q128).sub(n1).mod(Q128);
}

function mulDivCeil(a: BN, b: BN, denominator: BN) {
  if (denominator.eq(ZERO)) {
    throw new Error('division by 0');
  }
  const numerator = a.mul(b).add(denominator.sub(ONE));
  return numerator.div(denominator);
}

function getTokenAmountAFromLiquidity(
  sqrtPriceX64A: BN,
  sqrtPriceX64B: BN,
  liquidity: BN,
  roundUp: boolean
) {
  if (sqrtPriceX64A.gt(sqrtPriceX64B)) {
    [sqrtPriceX64A, sqrtPriceX64B] = [sqrtPriceX64B, sqrtPriceX64A];
  }

  if (!sqrtPriceX64A.gt(ZERO)) {
    throw new Error('sqrtPriceX64A must greater than 0');
  }

  const numerator1 = liquidity.ushln(U64Resolution);
  const numerator2 = sqrtPriceX64B.sub(sqrtPriceX64A);

  return roundUp
    ? mulDivRoundingUp(
        mulDivCeil(numerator1, numerator2, sqrtPriceX64B),
        ONE,
        sqrtPriceX64A
      )
    : mulDivFloor(numerator1, numerator2, sqrtPriceX64B).div(sqrtPriceX64A);
}

function getTokenAmountBFromLiquidity(
  sqrtPriceX64A: BN,
  sqrtPriceX64B: BN,
  liquidity: BN,
  roundUp: boolean
) {
  if (sqrtPriceX64A.gt(sqrtPriceX64B)) {
    [sqrtPriceX64A, sqrtPriceX64B] = [sqrtPriceX64B, sqrtPriceX64A];
  }
  if (!sqrtPriceX64A.gt(ZERO)) {
    throw new Error('sqrtPriceX64A must greater than 0');
  }

  return roundUp
    ? mulDivCeil(liquidity, sqrtPriceX64B.sub(sqrtPriceX64A), Q64)
    : mulDivFloor(liquidity, sqrtPriceX64B.sub(sqrtPriceX64A), Q64);
}

export function getRaydiumTokenAmountsFromLiquidity(
  sqrtPriceCurrentX64: BigNumber,
  sqrtPriceX64A: BigNumber,
  sqrtPriceX64B: BigNumber,
  liquidity: BigNumber,
  roundUp: boolean
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  if (sqrtPriceX64A.gt(sqrtPriceX64B)) {
    [sqrtPriceX64A, sqrtPriceX64B] = [sqrtPriceX64B, sqrtPriceX64A];
  }

  if (sqrtPriceCurrentX64.lte(sqrtPriceX64A)) {
    return {
      tokenAmountA: new BigNumber(
        getTokenAmountAFromLiquidity(
          new BN(sqrtPriceX64A.toString()),
          new BN(sqrtPriceX64B.toString()),
          new BN(liquidity.toString()),
          roundUp
        ).toString()
      ),
      tokenAmountB: new BigNumber(0),
    };
  }
  if (sqrtPriceCurrentX64.lt(sqrtPriceX64B)) {
    const amountA = new BigNumber(
      getTokenAmountAFromLiquidity(
        new BN(sqrtPriceCurrentX64.toString()),
        new BN(sqrtPriceX64B.toString()),
        new BN(liquidity.toString()),
        roundUp
      ).toString()
    );
    const amountB = new BigNumber(
      getTokenAmountBFromLiquidity(
        new BN(sqrtPriceX64A.toString()),
        new BN(sqrtPriceCurrentX64.toString()),
        new BN(liquidity.toString()),
        roundUp
      ).toString()
    );
    return { tokenAmountA: amountA, tokenAmountB: amountB };
  }
  return {
    tokenAmountA: new BigNumber(0),
    tokenAmountB: new BigNumber(
      getTokenAmountBFromLiquidity(
        new BN(sqrtPriceX64A.toString()),
        new BN(sqrtPriceX64B.toString()),
        new BN(liquidity.toString()),
        roundUp
      ).toString()
    ),
  };
}

export function getStakePubKey(owner: string) {
  return PublicKey.findProgramAddressSync(
    [
      new PublicKey('4EwbZo8BZXP5313z5A2H11MRBP15M5n6YxfmkjXESKAW').toBuffer(),
      new PublicKey(owner).toBuffer(),
      Buffer.from('staker_info_v2_associated_seed', 'utf-8'),
    ],
    AMM_PROGRAM_ID_V3
  )[0];
}

export function getFarmYield(
  rewardToken: TokenPrice,
  rewardPerBlock: BigNumber,
  tvl: number,
  slotsPerSec = 2
): Yield {
  const apr = rewardPerBlock
    .div(10 ** rewardToken.decimals)
    .times(slotsPerSec * 60 * 60 * 24 * 365 * rewardToken.price)
    .div(tvl)
    .toNumber();
  return {
    apr,
    apy: aprToApy(apr),
  };
}

export function getPendingAssetParams(
  depositBalance: BigNumber,
  rewardDebt: BigNumber,
  perShare: BigNumber,
  rewardToken: TokenPrice,
  multiplier: number | BigNumber
): PortfolioAssetTokenParams {
  const amount = depositBalance
    .times(perShare)
    .div(multiplier)
    .minus(rewardDebt)
    .div(10 ** rewardToken.decimals);
  return { address: rewardToken.address, amount, alreadyShifted: true };
}

function getRewardGrowthInsideV2(
  tickCurrentIndex: number,
  tickLowerState: Tick,
  tickUpperState: Tick,
  rewardInfos: Pick<ClmmPoolRewardInfo, 'rewardGrowthGlobalX64'>[]
): BN[] {
  const rewardGrowthsInside: BN[] = [];
  for (let i = 0; i < rewardInfos.length; i++) {
    let rewardGrowthsBelow = new BN(0);
    if (tickLowerState.liquidityGross.eqn(0)) {
      rewardGrowthsBelow = rewardInfos[i].rewardGrowthGlobalX64;
    } else if (tickCurrentIndex < tickLowerState.tick) {
      rewardGrowthsBelow = rewardInfos[i].rewardGrowthGlobalX64.sub(
        tickLowerState.rewardGrowthsOutsideX64[i]
      );
    } else {
      rewardGrowthsBelow = tickLowerState.rewardGrowthsOutsideX64[i];
    }

    let rewardGrowthsAbove = new BN(0);
    if (tickUpperState.liquidityGross.eqn(0)) {
      //
    } else if (tickCurrentIndex < tickUpperState.tick) {
      rewardGrowthsAbove = tickUpperState.rewardGrowthsOutsideX64[i];
    } else {
      rewardGrowthsAbove = rewardInfos[i].rewardGrowthGlobalX64.sub(
        tickUpperState.rewardGrowthsOutsideX64[i]
      );
    }

    rewardGrowthsInside.push(
      wrappingSubU128(
        wrappingSubU128(
          rewardInfos[i].rewardGrowthGlobalX64,
          rewardGrowthsBelow
        ),
        rewardGrowthsAbove
      )
    );
  }

  return rewardGrowthsInside;
}
const GetPositionRewardsV2 = (
  ammPool: Pick<ClmmPoolInfo, 'tickCurrent' | 'feeGrowthGlobalX64B'> & {
    rewardInfos: { rewardGrowthGlobalX64: BN }[];
  },
  positionState: {
    liquidity: BN;
    rewardInfos: {
      growthInsideLastX64: BN;
      rewardAmountOwed: BN;
    }[];
  },
  tickLowerState: Tick,
  tickUpperState: Tick
): BN[] => {
  const rewards: BN[] = [];
  const rewardGrowthsInside = getRewardGrowthInsideV2(
    ammPool.tickCurrent,
    tickLowerState,
    tickUpperState,
    ammPool.rewardInfos
  );
  for (let i = 0; i < rewardGrowthsInside.length; i++) {
    const rewardGrowthInside = rewardGrowthsInside[i];
    const currRewardInfo = positionState.rewardInfos[i];

    const rewardGrowthDelta = wrappingSubU128(
      rewardGrowthInside,
      currRewardInfo.growthInsideLastX64
    );
    const amountOwedDelta = mulDivFloor(
      rewardGrowthDelta,
      positionState.liquidity,
      Q64
    );
    const rewardAmountOwed =
      currRewardInfo.rewardAmountOwed.add(amountOwedDelta);
    rewards.push(rewardAmountOwed);
  }

  return rewards;
};

export const getTickArrayAddress = (
  programId: string,
  poolId: string,
  tickNumber: number,
  tickSpacing: number
) =>
  getTickArrayAddressByTick(
    new PublicKey(programId),
    new PublicKey(poolId),
    tickNumber,
    tickSpacing
  );

const TICK_ARRAY_SIZE = 60;

function tickCount(tickSpacing: number): number {
  return TICK_ARRAY_SIZE * tickSpacing;
}

function getTickArrayBitIndex(tickIndex: number, tickSpacing: number): number {
  const ticksInArray = tickCount(tickSpacing);

  let startIndex: number = tickIndex / ticksInArray;
  if (tickIndex < 0 && tickIndex % ticksInArray != 0) {
    startIndex = Math.ceil(startIndex) - 1;
  } else {
    startIndex = Math.floor(startIndex);
  }
  return startIndex;
}

function getTickArrayStartIndexByTick(
  tickIndex: number,
  tickSpacing: number
): number {
  return getTickArrayBitIndex(tickIndex, tickSpacing) * tickCount(tickSpacing);
}

const TICK_ARRAY_SEED = Buffer.from('tick_array', 'utf8');

function getPdaTickArrayAddress(
  programId: PublicKey,
  poolId: PublicKey,
  startIndex: number
): {
  publicKey: PublicKey;
  nonce: number;
} {
  return findProgramAddress(
    [TICK_ARRAY_SEED, poolId.toBuffer(), i32ToBytes(startIndex)],
    programId
  );
}

function getTickArrayAddressByTick(
  programId: PublicKey,
  poolId: PublicKey,
  tickIndex: number,
  tickSpacing: number
): PublicKey {
  const startIndex = getTickArrayStartIndexByTick(tickIndex, tickSpacing);
  const { publicKey: tickArrayAddress } = getPdaTickArrayAddress(
    programId,
    poolId,
    startIndex
  );
  return tickArrayAddress;
}

function i32ToBytes(num: number): Uint8Array {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setInt32(0, num, false);
  return new Uint8Array(arr);
}

function findProgramAddress(
  seeds: Array<Buffer | Uint8Array>,
  programId: PublicKey
): {
  publicKey: PublicKey;
  nonce: number;
} {
  const [publicKey, nonce] = PublicKey.findProgramAddressSync(seeds, programId);
  return { publicKey, nonce };
}

function getTickOffsetInArray(tickIndex: number, tickSpacing: number): number {
  if (tickIndex % tickSpacing != 0) {
    throw new Error('tickIndex % tickSpacing not equal 0');
  }
  const startTickIndex = getTickArrayStartIndexByTick(tickIndex, tickSpacing);
  const offsetInArray = Math.floor((tickIndex - startTickIndex) / tickSpacing);
  if (offsetInArray < 0 || offsetInArray >= TICK_ARRAY_SIZE) {
    throw new Error('tick offset in array overflow');
  }
  return offsetInArray;
}

function getfeeGrowthInside(
  poolState: Pick<
    ClmmPoolInfo,
    'tickCurrent' | 'feeGrowthGlobalX64A' | 'feeGrowthGlobalX64B'
  >,
  tickLowerState: Tick,
  tickUpperState: Tick
): { feeGrowthInsideX64A: BN; feeGrowthInsideBX64: BN } {
  let feeGrowthBelowX64A = new BN(0);
  let feeGrowthBelowX64B = new BN(0);
  if (poolState.tickCurrent >= tickLowerState.tick) {
    feeGrowthBelowX64A = tickLowerState.feeGrowthOutsideX64A;
    feeGrowthBelowX64B = tickLowerState.feeGrowthOutsideX64B;
  } else {
    feeGrowthBelowX64A = poolState.feeGrowthGlobalX64A.sub(
      tickLowerState.feeGrowthOutsideX64A
    );
    feeGrowthBelowX64B = poolState.feeGrowthGlobalX64B.sub(
      tickLowerState.feeGrowthOutsideX64B
    );
  }

  let feeGrowthAboveX64A = new BN(0);
  let feeGrowthAboveX64B = new BN(0);
  if (poolState.tickCurrent < tickUpperState.tick) {
    feeGrowthAboveX64A = tickUpperState.feeGrowthOutsideX64A;
    feeGrowthAboveX64B = tickUpperState.feeGrowthOutsideX64B;
  } else {
    feeGrowthAboveX64A = poolState.feeGrowthGlobalX64A.sub(
      tickUpperState.feeGrowthOutsideX64A
    );
    feeGrowthAboveX64B = poolState.feeGrowthGlobalX64B.sub(
      tickUpperState.feeGrowthOutsideX64B
    );
  }

  const feeGrowthInsideX64A = wrappingSubU128(
    wrappingSubU128(poolState.feeGrowthGlobalX64A, feeGrowthBelowX64A),
    feeGrowthAboveX64A
  );
  const feeGrowthInsideBX64 = wrappingSubU128(
    wrappingSubU128(poolState.feeGrowthGlobalX64B, feeGrowthBelowX64B),
    feeGrowthAboveX64B
  );
  return { feeGrowthInsideX64A, feeGrowthInsideBX64 };
}

function GetPositionFeesV2(
  ammPool: Pick<
    ClmmPoolInfo,
    'tickCurrent' | 'feeGrowthGlobalX64A' | 'feeGrowthGlobalX64B'
  >,
  positionState: {
    liquidity: BN;
    rewardInfos: {
      growthInsideLastX64: BN;
      rewardAmountOwed: BN;
    }[];
    feeGrowthInsideLastX64A: BN;
    feeGrowthInsideLastX64B: BN;
    tokenFeesOwedA: BN;
    tokenFeesOwedB: BN;
  },
  tickLowerState: Tick,
  tickUpperState: Tick
): { tokenFeeAmountA: BN; tokenFeeAmountB: BN } {
  const { feeGrowthInsideX64A, feeGrowthInsideBX64 } = getfeeGrowthInside(
    ammPool,
    tickLowerState,
    tickUpperState
  );

  const feeGrowthdeltaA = mulDivFloor(
    wrappingSubU128(feeGrowthInsideX64A, positionState.feeGrowthInsideLastX64A),
    positionState.liquidity,
    Q64
  );
  const tokenFeeAmountA = positionState.tokenFeesOwedA.add(feeGrowthdeltaA);

  const feeGrowthdelta1 = mulDivFloor(
    wrappingSubU128(feeGrowthInsideBX64, positionState.feeGrowthInsideLastX64B),
    positionState.liquidity,
    Q64
  );
  const tokenFeeAmountB = positionState.tokenFeesOwedB.add(feeGrowthdelta1);

  return { tokenFeeAmountA, tokenFeeAmountB };
}

export const getFeesAndRewardsBalance = (
  personalPositionInfo: ParsedAccount<PersonalPositionState>,
  poolStateInfo: ParsedAccount<PoolState>,
  tickArrays: (ParsedAccount<TickArrayState> | null)[]
): {
  tokenFeeAmountA: BigNumber;
  tokenFeeAmountB: BigNumber;
  rewards: BigNumber[];
} | null => {
  const [tickArrayLower, tickArrayUpper] = tickArrays;

  if (!tickArrayLower || !tickArrayUpper) return null;

  const tickLowerState =
    tickArrayLower &&
    tickArrayLower.ticks[
      getTickOffsetInArray(
        personalPositionInfo.tickLowerIndex,
        poolStateInfo.tickSpacing
      )
    ];
  const tickUpperState =
    tickArrayUpper &&
    tickArrayUpper.ticks[
      getTickOffsetInArray(
        personalPositionInfo.tickUpperIndex,
        poolStateInfo.tickSpacing
      )
    ];

  if (!tickLowerState || !tickUpperState) return null;

  const ammPool = {
    tickCurrent: poolStateInfo.tickCurrent,
    feeGrowthGlobalX64A: toBN(poolStateInfo.feeGrowthGlobal0X64),
    feeGrowthGlobalX64B: toBN(poolStateInfo.feeGrowthGlobal1X64),
    rewardInfos: poolStateInfo.rewardInfos.map((ri) => ({
      rewardGrowthGlobalX64: toBN(ri.rewardGrowthGlobalX64),
    })),
  };
  const positionState = {
    liquidity: toBN(personalPositionInfo.liquidity),
    rewardInfos: personalPositionInfo.rewardInfos.map((ri) => ({
      growthInsideLastX64: toBN(ri.growthInsideLastX64),
      rewardAmountOwed: toBN(ri.rewardAmountOwed),
    })),
    feeGrowthInsideLastX64A: toBN(personalPositionInfo.feeGrowthInside0LastX64),
    feeGrowthInsideLastX64B: toBN(personalPositionInfo.feeGrowthInside1LastX64),
    tokenFeesOwedA: toBN(personalPositionInfo.tokenFeesOwed0),
    tokenFeesOwedB: toBN(personalPositionInfo.tokenFeesOwed1),
  };

  const tickLowerS = {
    tick: tickLowerState.tick,
    liquidityNet: toBN(tickLowerState.liquidityNet),
    liquidityGross: toBN(tickLowerState.liquidityGross),
    feeGrowthOutsideX64A: toBN(tickLowerState.feeGrowthOutsideX64A),
    feeGrowthOutsideX64B: toBN(tickLowerState.feeGrowthOutsideX64B),
    rewardGrowthsOutsideX64: [
      toBN(tickLowerState.rewardGrowthsOutsideX640),
      toBN(tickLowerState.rewardGrowthsOutsideX641),
      toBN(tickLowerState.rewardGrowthsOutsideX642),
    ],
  };

  const tickUpperS = {
    tick: tickUpperState.tick,
    liquidityNet: toBN(tickUpperState.liquidityNet),
    liquidityGross: toBN(tickUpperState.liquidityGross),
    feeGrowthOutsideX64A: toBN(tickUpperState.feeGrowthOutsideX64A),
    feeGrowthOutsideX64B: toBN(tickUpperState.feeGrowthOutsideX64B),
    rewardGrowthsOutsideX64: [
      toBN(tickUpperState.rewardGrowthsOutsideX640),
      toBN(tickUpperState.rewardGrowthsOutsideX641),
      toBN(tickUpperState.rewardGrowthsOutsideX642),
    ],
  };

  const fees = GetPositionFeesV2(
    ammPool,
    positionState,
    tickLowerS,
    tickUpperS
  );
  const rewards = GetPositionRewardsV2(
    ammPool,
    positionState,
    tickLowerS,
    tickUpperS
  );

  return {
    tokenFeeAmountA: new BigNumber(fees.tokenFeeAmountA.toString(10)),
    tokenFeeAmountB: new BigNumber(fees.tokenFeeAmountB.toString(10)),
    rewards: rewards.map((bn) => new BigNumber(bn.toString(10))),
  };
};
