import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  Position,
  Tick,
  TickArray,
  tickArrayStruct,
  Whirlpool,
  WhirlpoolRewardInfo,
} from './structs/whirlpool';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { whirlpoolProgram } from './constants';
import { getClientSolana } from '../../utils/clients';
import { toBN } from '../../utils/misc/toBN';

const TWO = new BN(2);
const U128 = TWO.pow(new BN(128));
const TICK_ARRAY_SIZE = 88;
const MAX_TICK_INDEX = 443636;
const MIN_TICK_INDEX = -443636;
const NUM_REWARDS = 3;

export const getTickArraysAsMap = async (
  positionsInfo: (ParsedAccount<Position> | null)[],
  whirlpoolMap: Map<string, Whirlpool>
): Promise<Map<string, TickArray>> => {
  const client = getClientSolana();

  const tickArrayAddresses = [];

  for (let index = 0; index < positionsInfo.length; index++) {
    const positionInfo = positionsInfo[index];
    if (!positionInfo) continue;

    const whirlpoolInfo = whirlpoolMap.get(positionInfo.whirlpool.toString());
    if (!whirlpoolInfo) continue;

    tickArrayAddresses.push(
      getTickArrayPda(
        whirlpoolProgram,
        positionInfo.whirlpool,
        getStartTickIndex(
          positionInfo.tickLowerIndex,
          whirlpoolInfo.tickSpacing
        )
      ),
      getTickArrayPda(
        whirlpoolProgram,
        positionInfo.whirlpool,
        getStartTickIndex(
          positionInfo.tickUpperIndex,
          whirlpoolInfo.tickSpacing
        )
      )
    );
  }

  const tickArrays = await getParsedMultipleAccountsInfo(
    client,
    tickArrayStruct,
    tickArrayAddresses
  );

  const tickArraysAsMap = new Map<string, TickArray>();

  tickArrays.forEach((ta) => {
    if (ta) tickArraysAsMap.set(ta.pubkey.toString(), ta);
  });

  return tickArraysAsMap;
};

export const calcFeesAndRewards = (
  whirlpool: Whirlpool,
  position: ParsedAccount<Position>,
  tickArrays: Map<string, TickArray>
) => {
  const tickArrayLowerAddress = getTickArrayPda(
    whirlpoolProgram,
    position.whirlpool,
    getStartTickIndex(position.tickLowerIndex, whirlpool.tickSpacing)
  );

  const tickArrayUpperAddress = getTickArrayPda(
    whirlpoolProgram,
    position.whirlpool,
    getStartTickIndex(position.tickUpperIndex, whirlpool.tickSpacing)
  );

  const tickArrayLower = tickArrays.get(tickArrayLowerAddress.toString());
  const tickArrayUpper = tickArrays.get(tickArrayUpperAddress.toString());

  if (!tickArrayLower || !tickArrayUpper) {
    return null;
  }

  const tickLower = getTick(
    tickArrayLower,
    position.tickLowerIndex,
    whirlpool.tickSpacing
  );
  const tickUpper = getTick(
    tickArrayUpper,
    position.tickUpperIndex,
    whirlpool.tickSpacing
  );

  const rewards = getCollectRewardsQuoteInternal({
    whirlpool,
    position,
    tickLower,
    tickUpper,
  });

  const fees = getCollectFeesQuoteInternal({
    whirlpool,
    position,
    tickLower,
    tickUpper,
  });

  return { ...rewards, ...fees };
};

function invariant(
  condition: any,
  message?: string | (() => string)
): asserts condition {
  if (condition) {
    return;
  }

  const prefix = 'Invariant failed';

  const provided: string | undefined =
    typeof message === 'function' ? message() : message;

  const value: string = provided ? `${prefix}: ${provided}` : prefix;
  throw new Error(value);
}

function getStartTickIndex(
  tickIndex: number,
  tickSpacing: number,
  offset = 0
): number {
  const realIndex = Math.floor(tickIndex / tickSpacing / TICK_ARRAY_SIZE);
  const startTickIndex = (realIndex + offset) * tickSpacing * TICK_ARRAY_SIZE;

  const ticksInArray = TICK_ARRAY_SIZE * tickSpacing;
  const minTickIndex =
    MIN_TICK_INDEX - ((MIN_TICK_INDEX % ticksInArray) + ticksInArray);
  invariant(startTickIndex >= minTickIndex, 'startTickIndex is too small');
  invariant(startTickIndex <= MAX_TICK_INDEX, 'startTickIndex is too large');
  return startTickIndex;
}

function getTickArrayPda(
  programId: PublicKey,
  whirlpool: PublicKey,
  startIndex: number
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('tick_array', 'utf8'),
      whirlpool.toBuffer(),
      Buffer.from(startIndex.toString(), 'utf8'),
    ],
    programId
  )[0];
}

function subUnderflowU128(n0: BN, n1: BN): BN {
  return n0.add(U128).sub(n1).mod(U128);
}

function getCollectFeesQuoteInternal(param: {
  whirlpool: Whirlpool;
  position: Position;
  tickLower: Tick;
  tickUpper: Tick;
}): {
  feeOwedA: BigNumber;
  feeOwedB: BigNumber;
} {
  const { whirlpool, position, tickLower, tickUpper } = param;

  const {
    tickCurrentIndex,
    feeGrowthGlobalA: feeGrowthGlobalAX64,
    feeGrowthGlobalB: feeGrowthGlobalBX64,
  } = whirlpool;
  const {
    tickLowerIndex,
    tickUpperIndex,
    liquidity,
    feeOwedA,
    feeOwedB,
    feeGrowthCheckpointA: feeGrowthCheckpointAX64,
    feeGrowthCheckpointB: feeGrowthCheckpointBX64,
  } = position;
  const {
    feeGrowthOutsideA: tickLowerFeeGrowthOutsideAX64,
    feeGrowthOutsideB: tickLowerFeeGrowthOutsideBX64,
  } = tickLower;
  const {
    feeGrowthOutsideA: tickUpperFeeGrowthOutsideAX64,
    feeGrowthOutsideB: tickUpperFeeGrowthOutsideBX64,
  } = tickUpper;

  // Calculate the fee growths inside the position

  let feeGrowthBelowAX64: BN | null = null;
  let feeGrowthBelowBX64: BN | null = null;

  if (tickCurrentIndex < tickLowerIndex) {
    feeGrowthBelowAX64 = subUnderflowU128(
      toBN(feeGrowthGlobalAX64),
      toBN(tickLowerFeeGrowthOutsideAX64)
    );
    feeGrowthBelowBX64 = subUnderflowU128(
      toBN(feeGrowthGlobalBX64),
      toBN(tickLowerFeeGrowthOutsideBX64)
    );
  } else {
    feeGrowthBelowAX64 = toBN(tickLowerFeeGrowthOutsideAX64);
    feeGrowthBelowBX64 = toBN(tickLowerFeeGrowthOutsideBX64);
  }

  let feeGrowthAboveAX64: BN | null = null;
  let feeGrowthAboveBX64: BN | null = null;

  if (tickCurrentIndex < tickUpperIndex) {
    feeGrowthAboveAX64 = toBN(tickUpperFeeGrowthOutsideAX64);
    feeGrowthAboveBX64 = toBN(tickUpperFeeGrowthOutsideBX64);
  } else {
    feeGrowthAboveAX64 = subUnderflowU128(
      toBN(feeGrowthGlobalAX64),
      toBN(tickUpperFeeGrowthOutsideAX64)
    );
    feeGrowthAboveBX64 = subUnderflowU128(
      toBN(feeGrowthGlobalBX64),
      toBN(tickUpperFeeGrowthOutsideBX64)
    );
  }

  const feeGrowthInsideAX64 = subUnderflowU128(
    subUnderflowU128(toBN(feeGrowthGlobalAX64), feeGrowthBelowAX64),
    feeGrowthAboveAX64
  );
  const feeGrowthInsideBX64 = subUnderflowU128(
    subUnderflowU128(toBN(feeGrowthGlobalBX64), feeGrowthBelowBX64),
    feeGrowthAboveBX64
  );

  // Calculate the updated fees owed
  const feeOwedADelta = subUnderflowU128(
    feeGrowthInsideAX64,
    toBN(feeGrowthCheckpointAX64)
  )
    .mul(toBN(liquidity))
    .shrn(64);
  const feeOwedBDelta = subUnderflowU128(
    feeGrowthInsideBX64,
    toBN(feeGrowthCheckpointBX64)
  )
    .mul(toBN(liquidity))
    .shrn(64);

  const updatedFeeOwedA = feeOwedA.plus(feeOwedADelta.toString());
  const updatedFeeOwedB = feeOwedB.plus(feeOwedBDelta.toString());

  return {
    feeOwedA: updatedFeeOwedA.isGreaterThan(10 ** 18)
      ? BigNumber(0)
      : updatedFeeOwedA,
    feeOwedB: updatedFeeOwedB.isGreaterThan(10 ** 18)
      ? BigNumber(0)
      : updatedFeeOwedB,
  };
}

function getTick(
  tickArray: TickArray,
  tickIndex: number,
  tickSpacing: number
): Tick {
  const realIndex = tickIndexToTickArrayIndex(
    tickArray,
    tickIndex,
    tickSpacing
  );
  const tick = tickArray.ticks[realIndex];
  invariant(!!tick, 'tick realIndex out of range');
  return tick;
}

function tickIndexToTickArrayIndex(
  { startTickIndex }: TickArray,
  tickIndex: number,
  tickSpacing: number
): number {
  return Math.floor((tickIndex - startTickIndex) / tickSpacing);
}

export function isRewardInitialized(rewardInfo: WhirlpoolRewardInfo): boolean {
  return (
    rewardInfo.mint.toString() !== '11111111111111111111111111111111' &&
    rewardInfo.vault.toString() !== '11111111111111111111111111111111'
  );
}

export function getCollectRewardsQuoteInternal(param: {
  whirlpool: Whirlpool;
  position: Position;
  tickLower: Tick;
  tickUpper: Tick;
}): {
  rewardOwedA: BigNumber;
  rewardOwedB: BigNumber;
  rewardOwedC: BigNumber;
} {
  const { whirlpool, position, tickLower, tickUpper } = param;

  const { tickCurrentIndex, rewardInfos: whirlpoolRewardsInfos } = whirlpool;
  const { tickLowerIndex, tickUpperIndex, liquidity, rewardInfos } = position;

  // Calculate the reward growths inside the position

  const range = [...Array(NUM_REWARDS).keys()];
  const rewardGrowthsBelowX64: BN[] = range.map(() => new BN(0));
  const rewardGrowthsAboveX64: BN[] = range.map(() => new BN(0));

  const tickLowerRewardGrowthsOutside = [
    tickLower.rewardGrowthsOutside1,
    tickLower.rewardGrowthsOutside2,
    tickLower.rewardGrowthsOutside3,
  ];
  const tickUpperRewardGrowthsOutside = [
    tickUpper.rewardGrowthsOutside1,
    tickUpper.rewardGrowthsOutside2,
    tickLower.rewardGrowthsOutside3,
  ];

  for (const i of range) {
    const rewardInfo = whirlpoolRewardsInfos[i];
    invariant(!!rewardInfo, 'whirlpoolRewardsInfos cannot be undefined');

    const { growthGlobalX64 } = rewardInfo;
    const lowerRewardGrowthsOutside = tickLowerRewardGrowthsOutside[i];
    const upperRewardGrowthsOutside = tickUpperRewardGrowthsOutside[i];
    invariant(
      !!lowerRewardGrowthsOutside,
      'lowerRewardGrowthsOutside cannot be undefined'
    );
    invariant(
      !!upperRewardGrowthsOutside,
      'upperRewardGrowthsOutside cannot be undefined'
    );

    if (tickCurrentIndex < tickLowerIndex) {
      rewardGrowthsBelowX64[i] = subUnderflowU128(
        toBN(growthGlobalX64),
        toBN(lowerRewardGrowthsOutside)
      );
    } else {
      rewardGrowthsBelowX64[i] = toBN(lowerRewardGrowthsOutside);
    }

    if (tickCurrentIndex < tickUpperIndex) {
      rewardGrowthsAboveX64[i] = toBN(upperRewardGrowthsOutside);
    } else {
      rewardGrowthsAboveX64[i] = subUnderflowU128(
        toBN(growthGlobalX64),
        toBN(upperRewardGrowthsOutside)
      );
    }
  }

  const rewardGrowthsInsideX64: [BN, boolean][] = range.map(() => [
    new BN(0),
    false,
  ]);

  for (const i of range) {
    const rewardInfo = whirlpoolRewardsInfos[i];
    invariant(!!rewardInfo, 'whirlpoolRewardsInfos cannot be undefined');

    const rewardInitialized = isRewardInitialized(rewardInfo);

    if (rewardInitialized) {
      const growthBelowX64 = rewardGrowthsBelowX64[i];
      const growthAboveX64 = rewardGrowthsAboveX64[i];
      invariant(!!growthBelowX64, 'growthBelowX64 cannot be undefined');
      invariant(!!growthAboveX64, 'growthAboveX64 cannot be undefined');

      const growthInsde = subUnderflowU128(
        subUnderflowU128(toBN(rewardInfo.growthGlobalX64), growthBelowX64),
        growthAboveX64
      );
      rewardGrowthsInsideX64[i] = [growthInsde, true];
    }
  }

  // Calculate the updated rewards owed

  const updatedRewardInfosX64: BN[] = range.map(() => new BN(0));

  for (const i of range) {
    const growthInsideX64 = rewardGrowthsInsideX64[i];
    invariant(!!growthInsideX64, 'growthInsideX64 cannot be undefined');

    const [rewardGrowthInsideX64, isRewardAlreadyInitialized] = growthInsideX64;

    if (isRewardAlreadyInitialized) {
      const rewardInfo = rewardInfos[i];
      invariant(!!rewardInfo, 'rewardInfo cannot be undefined');

      const amountOwedX64 = toBN(rewardInfo.amountOwed).shln(64);
      const growthInsideCheckpointX64 = rewardInfo.growthInsideCheckpoint;
      updatedRewardInfosX64[i] = amountOwedX64.add(
        subUnderflowU128(
          rewardGrowthInsideX64,
          toBN(growthInsideCheckpointX64)
        ).mul(toBN(liquidity))
      );
    }
  }

  invariant(
    rewardGrowthsInsideX64.length >= 3,
    'rewards length is less than 3'
  );

  const rewardExistsA = rewardGrowthsInsideX64[0]?.[1];
  const rewardExistsB = rewardGrowthsInsideX64[1]?.[1];
  const rewardExistsC = rewardGrowthsInsideX64[2]?.[1];

  const finalRewardA = rewardExistsA
    ? new BigNumber(updatedRewardInfosX64[0]?.shrn(64).toString())
    : new BigNumber(0);
  const finalRewardB = rewardExistsB
    ? new BigNumber(updatedRewardInfosX64[1]?.shrn(64).toString())
    : new BigNumber(0);
  const finalRewardC = rewardExistsC
    ? new BigNumber(updatedRewardInfosX64[2]?.shrn(64).toString())
    : new BigNumber(0);

  const rewardOwedA = finalRewardA.isGreaterThan(10 ** 18)
    ? BigNumber(0)
    : finalRewardA;
  const rewardOwedB = finalRewardB.isGreaterThan(10 ** 18)
    ? BigNumber(0)
    : finalRewardB;
  const rewardOwedC = finalRewardC.isGreaterThan(10 ** 18)
    ? BigNumber(0)
    : finalRewardC;

  return { rewardOwedA, rewardOwedB, rewardOwedC };
}
