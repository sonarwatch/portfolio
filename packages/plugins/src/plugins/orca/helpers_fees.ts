import {
  Position,
  Tick,
  TickArray,
  tickArrayStruct,
  Whirlpool,
} from './structs/whirlpool';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { whirlpoolProgram } from './constants';
import { getClientSolana } from '../../utils/clients';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { toBN } from '../../utils/misc/toBN';
import BigNumber from 'bignumber.js';

const TWO = new BN(2);
const U128 = TWO.pow(new BN(128));
const TICK_ARRAY_SIZE = 88;
const MAX_TICK_INDEX = 443636;
const MIN_TICK_INDEX = -443636;

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

export const getFees = (
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
    return { feeOwedA: new BigNumber(0), feeOwedB: new BigNumber(0) };
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

  return getCollectFeesQuoteInternal({
    whirlpool,
    position,
    tickUpper,
    tickLower,
  });
};

function invariant(
  condition: any,
  message?: string | (() => string)
): asserts condition {
  if (condition) {
    return;
  }

  const prefix: string = 'Invariant failed';

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
    feeOwedA: updatedFeeOwedA,
    feeOwedB: updatedFeeOwedB,
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
