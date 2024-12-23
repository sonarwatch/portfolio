/* eslint-disable eqeqeq */
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import BigNumber from 'bignumber.js';
import {
  BinLiquidity,
  LMRewards,
  PositionBinData,
  PositionData,
  PositionVersion,
  SwapFee,
} from './types';
import {
  Bin,
  BinArray,
  BinArrayBitmapExtension,
  binArrayStruct,
  DLMMPosition,
  LbPair,
  StaticParameters,
  VariableParameters,
} from './struct';
import { dlmmProgramId } from './constants';
import { toBN } from '../../utils/misc/toBN';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';

export const MAX_BIN_ARRAY_SIZE = new BN(70);
export const SCALE_OFFSET = 64;
export const BASIS_POINT_MAX = 10000;
export const BIN_ARRAY_BITMAP_SIZE = new BN(512);
export const EXTENSION_BINARRAY_BITMAP_SIZE = new BN(12);

enum BitmapType {
  U1024,
  U512,
}

export function binIdToBinArrayIndex(binId: BigNumber): BN {
  const tempBinId = toBN(binId);
  const { div: idx, mod } = tempBinId.divmod(MAX_BIN_ARRAY_SIZE);
  return tempBinId.isNeg() && !mod.isZero() ? idx.sub(new BN(1)) : idx;
}

export function deriveBinArrayBitmapExtension(
  lbPair: PublicKey,
  programId: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('bitmap'), lbPair.toBytes()],
    programId
  );
}

export function deriveBinArray(
  lbPair: PublicKey,
  index: BN,
  programId: PublicKey
) {
  let binArrayBytes: Uint8Array;
  if (index.isNeg()) {
    binArrayBytes = new Uint8Array(index.toTwos(64).toBuffer('le', 8));
  } else {
    binArrayBytes = new Uint8Array(index.toBuffer('le', 8));
  }
  return PublicKey.findProgramAddressSync(
    [Buffer.from('bin_array'), lbPair.toBytes(), binArrayBytes],
    programId
  );
}

export function processPosition(
  program: PublicKey,
  version: PositionVersion,
  lbPair: LbPair,
  position: DLMMPosition,
  baseTokenDecimal: number,
  quoteTokenDecimal: number,
  lowerBinArray: BinArray,
  upperBinArray: BinArray
): PositionData | null {
  const { lowerBinId, upperBinId, liquidityShares: posShares } = position;

  const bins = getBinsBetweenLowerAndUpperBound(
    lbPair,
    lowerBinId,
    upperBinId,
    baseTokenDecimal,
    quoteTokenDecimal,
    lowerBinArray,
    upperBinArray
  );

  if (!bins.length) return null;

  /// assertion
  if (bins[0].binId != lowerBinId || bins[bins.length - 1].binId != upperBinId)
    throw new Error('Bin ID mismatch');

  const positionData: PositionBinData[] = [];
  let totalXAmount = new Decimal(0);
  let totalYAmount = new Decimal(0);

  bins.forEach((bin, idx) => {
    const binSupply = new Decimal(bin.supply.toString());

    let posShare;
    if (bin.version === 1 && version === PositionVersion.V1) {
      posShare = new Decimal(posShares[idx].shiftedBy(-64).toString());
    } else {
      posShare = new Decimal(posShares[idx].toString());
    }
    const positionXAmount = binSupply.eq(new Decimal('0'))
      ? new Decimal('0')
      : posShare.mul(bin.xAmount.toString()).div(binSupply).floor();
    const positionYAmount = binSupply.eq(new Decimal('0'))
      ? new Decimal('0')
      : posShare.mul(bin.yAmount.toString()).div(binSupply).floor();

    totalXAmount = totalXAmount.add(positionXAmount);
    totalYAmount = totalYAmount.add(positionYAmount);

    positionData.push({
      binId: bin.binId,
      price: bin.price,
      pricePerToken: bin.pricePerToken,
      binXAmount: bin.xAmount.toString(),
      binYAmount: bin.yAmount.toString(),
      binLiquidity: binSupply.toString(),
      positionLiquidity: posShare.toString(),
      positionXAmount: positionXAmount.toString(),
      positionYAmount: positionYAmount.toString(),
    });
  });

  const { feeX, feeY } = getClaimableSwapFee(
    program,
    version,
    position,
    lowerBinArray,
    upperBinArray
  );
  const { rewardOne, rewardTwo } = getClaimableLMReward(
    program,
    version,
    lbPair,
    new Date(Date.now()).getTime(),
    position,
    lowerBinArray,
    upperBinArray
  );

  return {
    totalXAmount: new BigNumber(totalXAmount.toString()),
    totalYAmount: new BigNumber(totalYAmount.toString()),
    positionBinData: positionData,
    lowerBinId,
    upperBinId,
    feeX,
    feeY,
    rewardOne,
    rewardTwo,
  };
}

export function getBinsBetweenLowerAndUpperBound(
  lbPair: LbPair,
  lowerBinId: number,
  upperBinId: number,
  baseTokenDecimal: number,
  quoteTokenDecimal: number,
  lowerBinArrays: BinArray,
  upperBinArrays: BinArray
): BinLiquidity[] {
  const lowerBinArrayIndex = binIdToBinArrayIndex(new BigNumber(lowerBinId));
  const upperBinArrayIndex = binIdToBinArrayIndex(new BigNumber(upperBinId));

  const bins: BinLiquidity[] = [];
  if (lowerBinArrayIndex.eq(upperBinArrayIndex)) {
    const binArray = lowerBinArrays;

    const [lowerBinIdForBinArray] = getBinArrayLowerUpperBinId(binArray.index);

    binArray.bins.forEach((bin, idx) => {
      const binId = lowerBinIdForBinArray.toNumber() + idx;

      if (binId >= lowerBinId && binId <= upperBinId) {
        const pricePerLamport = getPriceOfBinByBinId(lbPair.binStep, binId);
        bins.push({
          binId,
          xAmount: bin.amountX,
          yAmount: bin.amountY,
          supply: bin.liquiditySupply,
          price: pricePerLamport,
          version: binArray.version,
          pricePerToken: new Decimal(pricePerLamport)
            .mul(new Decimal(10 ** (baseTokenDecimal - quoteTokenDecimal)))
            .toString(),
        });
      }
    });
  } else {
    const binArrays = [lowerBinArrays, upperBinArrays];

    binArrays.forEach((binArray) => {
      const [lowerBinIdForBinArray] = getBinArrayLowerUpperBinId(
        binArray.index
      );
      binArray.bins.forEach((bin, idx) => {
        const binId = lowerBinIdForBinArray.toNumber() + idx;
        if (binId >= lowerBinId && binId <= upperBinId) {
          const pricePerLamport = getPriceOfBinByBinId(lbPair.binStep, binId);
          bins.push({
            binId,
            xAmount: bin.amountX,
            yAmount: bin.amountY,
            supply: bin.liquiditySupply,
            price: pricePerLamport,
            version: binArray.version,
            pricePerToken: new Decimal(pricePerLamport)
              .mul(new Decimal(10 ** (baseTokenDecimal - quoteTokenDecimal)))
              .toString(),
          });
        }
      });
    });
  }

  return bins;
}

export function getClaimableLMReward(
  program: PublicKey,
  positionVersion: PositionVersion,
  lbPair: LbPair,
  onChainTimestamp: number,
  position: DLMMPosition,
  lowerBinArray: BinArray,
  upperBinArray: BinArray
): LMRewards {
  const lowerBinArrayIdx = binIdToBinArrayIndex(
    new BigNumber(position.lowerBinId)
  );

  const rewards = [new BigNumber(0), new BigNumber(0)];

  if (!lowerBinArray || !upperBinArray) throw new Error('BinArray not found');

  for (let i = position.lowerBinId; i <= position.upperBinId; i++) {
    const binArrayIdx = binIdToBinArrayIndex(new BigNumber(i));
    const binArray = binArrayIdx.eq(lowerBinArrayIdx)
      ? lowerBinArray
      : upperBinArray;
    const binState = getBinFromBinArray(i, binArray);
    const binIdxInPosition = i - position.lowerBinId;

    const positionRewardInfo = position.rewardInfos[binIdxInPosition];

    const liquidityShare =
      positionVersion === PositionVersion.V1
        ? toBN(position.liquidityShares[binIdxInPosition])
        : toBN(position.liquidityShares[binIdxInPosition]).shrn(64);

    for (let j = 0; j < 2; j++) {
      const pairRewardInfo = lbPair.rewardInfos[j];

      if (!pairRewardInfo.mint.equals(PublicKey.default)) {
        let rewardPerTokenStored =
          j === 0
            ? binState.rewardPerTokenXStored
            : binState.rewardPerTokenYStored;

        if (i == lbPair.activeId && !binState.liquiditySupply.isZero()) {
          const currentTime = new BigNumber(
            Math.min(
              onChainTimestamp,
              pairRewardInfo.rewardDurationEnd.toNumber()
            )
          );
          const delta = currentTime.minus(pairRewardInfo.lastUpdateTime);
          const liquiditySupply =
            binArray.version === 0
              ? binState.liquiditySupply
              : binState.liquiditySupply.shiftedBy(64);
          const rewardPerTokenStoredDelta = pairRewardInfo.rewardRate
            .times(delta.toString())
            .div(new BigNumber(15))
            .div(liquiditySupply);
          rewardPerTokenStored = rewardPerTokenStored.plus(
            rewardPerTokenStoredDelta
          );
        }

        const delta = rewardPerTokenStored.minus(
          j === 0
            ? positionRewardInfo.rewardPerTokenCompletesX
            : positionRewardInfo.rewardPerTokenCompletesY
        );
        const newReward = mulShr(
          toBN(delta),
          liquidityShare,
          SCALE_OFFSET,
          Rounding.Down
        );
        rewards[j] = rewards[j]
          .plus(newReward)
          .plus(
            j === 0
              ? positionRewardInfo.rewardPendingsX
              : positionRewardInfo.rewardPendingsY
          );
      }
    }
  }

  return {
    rewardOne: rewards[0],
    rewardTwo: rewards[1],
  };
}

export function getClaimableSwapFee(
  program: PublicKey,
  positionVersion: PositionVersion,
  position: DLMMPosition,
  lowerBinArray: BinArray,
  upperBinArray: BinArray
): SwapFee {
  const lowerBinArrayIdx = binIdToBinArrayIndex(
    new BigNumber(position.lowerBinId)
  );

  let feeX = new BigNumber(0);
  let feeY = new BigNumber(0);

  if (!lowerBinArray || !upperBinArray) throw new Error('BinArray not found');

  for (let i = position.lowerBinId; i <= position.upperBinId; i++) {
    const binArrayIdx = binIdToBinArrayIndex(new BigNumber(i));
    const binArray = binArrayIdx.eq(lowerBinArrayIdx)
      ? lowerBinArray
      : upperBinArray;
    const binState = getBinFromBinArray(i, binArray);
    const binIdxInPosition = i - position.lowerBinId;

    const feeInfos = position.feeInfos[binIdxInPosition];

    const liquidityShare =
      positionVersion === PositionVersion.V1
        ? toBN(position.liquidityShares[binIdxInPosition])
        : toBN(position.liquidityShares[binIdxInPosition]).shrn(64);

    if (liquidityShare.isZero()) continue;

    const feeXPerToken = binState.feeAmountXPerTokenStored.minus(
      feeInfos.feeXPerTokenComplete
    );
    if (!feeXPerToken.isZero()) {
      const newFeeX = mulShr(
        liquidityShare,
        toBN(feeXPerToken),
        SCALE_OFFSET,
        Rounding.Down
      );
      feeX = feeX.plus(newFeeX).plus(feeInfos.feeXPending);
    }

    const feeYPerToken = binState.feeAmountYPerTokenStored.minus(
      feeInfos.feeYPerTokenComplete
    );
    if (!feeYPerToken.isZero()) {
      const newFeeY = mulShr(
        liquidityShare,
        toBN(feeYPerToken),
        SCALE_OFFSET,
        Rounding.Down
      );

      feeY = feeY.plus(newFeeY).plus(feeInfos.feeYPending);
    }
  }

  return { feeX, feeY };
}

export function getBinFromBinArray(binId: number, binArray: BinArray): Bin {
  const [lowerBinId, upperBinId] = getBinArrayLowerUpperBinId(binArray.index);

  let index;
  if (binId > 0) {
    index = binId - lowerBinId.toNumber();
  } else {
    const delta = upperBinId.toNumber() - binId;
    index = MAX_BIN_ARRAY_SIZE.toNumber() - delta - 1;
  }

  return binArray.bins[index];
}

export function getBinArrayLowerUpperBinId(binArrayIndex: BigNumber) {
  const lowerBinId = binArrayIndex.times(MAX_BIN_ARRAY_SIZE.toNumber());
  const upperBinId = lowerBinId
    .plus(MAX_BIN_ARRAY_SIZE.toNumber())
    .minus(new BigNumber(1));

  return [lowerBinId, upperBinId];
}

export enum Rounding {
  Up,
  Down,
}

export function mulShr(x: BN, y: BN, offset: number, rounding: Rounding) {
  const denominator = new BN(1).shln(offset);
  return mulDiv(x, y, denominator, rounding);
}

export function shlDiv(x: BN, y: BN, offset: number, rounding: Rounding) {
  const scale = new BN(1).shln(-offset);
  return mulDiv(x, scale, y, rounding);
}

export function mulDiv(x: BN, y: BN, denominator: BN, rounding: Rounding) {
  const { div: resultat, mod: reste } = x.mul(y).divmod(denominator);

  if (rounding == Rounding.Up && !reste.isZero()) {
    return new BigNumber(resultat.add(new BN(1)).toString());
  }
  return new BigNumber(resultat.toString());
}

export function getPriceOfBinByBinId(binStep: number, binId: number): string {
  const binStepNum = new Decimal(binStep).div(new Decimal(BASIS_POINT_MAX));
  return new Decimal(1)
    .add(new Decimal(binStepNum))
    .pow(new Decimal(binId))
    .toString();
}

export function getTokensAmountsFromLiquidity(
  position: DLMMPosition,
  pool: LbPair,
  lowerBinArray: BinArray,
  upperBinArray: BinArray,
  baseTokenDecimal: number,
  quoteTokenDecimal: number
): { tokenAmountA: BigNumber; tokenAmountB: BigNumber } {
  const positionVersion = PositionVersion.V2;

  const positionData = processPosition(
    dlmmProgramId,
    positionVersion,
    pool,
    position,
    baseTokenDecimal,
    quoteTokenDecimal,
    lowerBinArray,
    upperBinArray
  );

  if (!positionData)
    return { tokenAmountA: new BigNumber(0), tokenAmountB: new BigNumber(0) };

  return {
    tokenAmountA: positionData.totalXAmount,
    tokenAmountB: positionData.totalYAmount,
  };
}

export async function getBinArrayForSwap(
  lbPair: ParsedAccount<LbPair>,
  binArrayBitmapExtension?: BinArrayBitmapExtension,
  swapForY = false,
  count = 4
): Promise<ParsedAccount<BinArray>[]> {
  const binArraysPubkey = new Set<string>();

  let shouldStop = false;
  let activeIdToLoop = lbPair.activeId;

  while (!shouldStop) {
    const binArrayIndex = findNextBinArrayIndexWithLiquidity(
      swapForY,
      new BN(activeIdToLoop),
      lbPair,
      binArrayBitmapExtension ?? null
    );
    if (binArrayIndex === null) shouldStop = true;
    else {
      const [binArrayPubKey] = deriveBinArray(
        lbPair.pubkey,
        binArrayIndex,
        dlmmProgramId
      );
      binArraysPubkey.add(binArrayPubKey.toBase58());

      const [lowerBinId, upperBinId] = getBinArrayLowerUpperBinId(
        new BigNumber(binArrayIndex.toString())
      );
      activeIdToLoop = swapForY
        ? lowerBinId.toNumber() - 1
        : upperBinId.toNumber() + 1;
    }

    if (binArraysPubkey.size === count) shouldStop = true;
  }

  const accountsToFetch = Array.from(binArraysPubkey).map(
    (pubkey) => new PublicKey(pubkey)
  );

  const binArrays = await getParsedMultipleAccountsInfo(
    getClientSolana(),
    binArrayStruct,
    accountsToFetch
  );

  // const binArrays: BinArrayAccount[] = await Promise.all(
  //   binArraysAccInfoBuffer.map(async (accInfo, idx) => {
  //     const account: BinArray = this.program.coder.accounts.decode(
  //       'binArray',
  //       accInfo.data
  //     );
  //     const publicKey = accountsToFetch[idx];
  //     return {
  //       account,
  //       publicKey,
  //     };
  //   })
  // );

  const bins = binArrays
    .map((acc) => {
      if (!acc) return [];
      return acc;
    })
    .flat();

  return bins;
}

function findNextBinArrayIndexWithLiquidity(
  swapForY: boolean,
  activeId: BN,
  lbPairState: LbPair,
  binArrayBitmapExtension: BinArrayBitmapExtension | null
) {
  const [lowerBinArrayIndex, upperBinArrayIndex] = internalBitmapRange();
  let startBinArrayIndex = binIdToBinArrayIndex(
    new BigNumber(activeId.toNumber())
  );

  while (true) {
    if (
      isOverflowDefaultBinArrayBitmap(BigNumber(startBinArrayIndex.toNumber()))
    ) {
      if (binArrayBitmapExtension === null) {
        return null;
      }
      // When bin array index is negative, the MSB is smallest bin array index.

      const [minBinArrayIndex, maxBinArrayIndex] = extensionBitmapRange();

      if (startBinArrayIndex.isNeg()) {
        if (swapForY) {
          const binArrayIndex = findSetBit(
            startBinArrayIndex.toNumber(),
            minBinArrayIndex.toNumber(),
            binArrayBitmapExtension
          );

          if (binArrayIndex !== null) {
            return new BN(binArrayIndex);
          }
          return null;
        }
        const binArrayIndex = findSetBit(
          startBinArrayIndex.toNumber(),
          BIN_ARRAY_BITMAP_SIZE.neg().sub(new BN(1)).toNumber(),
          binArrayBitmapExtension
        );

        if (binArrayIndex !== null) {
          return new BN(binArrayIndex);
        }
        // Move to internal bitmap
        startBinArrayIndex = BIN_ARRAY_BITMAP_SIZE.neg();
      } else if (swapForY) {
        const binArrayIndex = findSetBit(
          startBinArrayIndex.toNumber(),
          BIN_ARRAY_BITMAP_SIZE.toNumber(),
          binArrayBitmapExtension
        );

        if (binArrayIndex !== null) {
          return new BN(binArrayIndex);
        }
        // Move to internal bitmap
        startBinArrayIndex = BIN_ARRAY_BITMAP_SIZE.sub(new BN(1));
      } else {
        const binArrayIndex = findSetBit(
          startBinArrayIndex.toNumber(),
          maxBinArrayIndex.toNumber(),
          binArrayBitmapExtension
        );

        if (binArrayIndex !== null) {
          return new BN(binArrayIndex);
        }
        return null;
      }
    } else {
      // Internal bitmap
      const bitmapType = BitmapType.U1024;
      const bitmapDetail = bitmapTypeDetail(bitmapType);
      const offset = startBinArrayIndex.add(BIN_ARRAY_BITMAP_SIZE);

      const bitmap = buildBitmapFromU64Arrays(
        lbPairState.binArrayBitmap.map((bN) => new BN(bN.toNumber()))
      );

      if (swapForY) {
        const upperBitRange = new BN(bitmapDetail.bits - 1).sub(offset);
        const croppedBitmap = bitmap.shln(upperBitRange.toNumber());

        const msb = mostSignificantBit(croppedBitmap, bitmapDetail.bits);

        if (msb !== null) {
          return startBinArrayIndex.sub(new BN(msb));
        }
        // Move to extension
        startBinArrayIndex = lowerBinArrayIndex.sub(new BN(1));
      } else {
        const lowerBitRange = offset;
        const croppedBitmap = bitmap.shrn(lowerBitRange.toNumber());
        const lsb = leastSignificantBit(croppedBitmap, bitmapDetail.bits);
        if (lsb !== null) {
          return startBinArrayIndex.add(new BN(lsb));
        }
        // Move to extension
        startBinArrayIndex = upperBinArrayIndex.add(new BN(1));
      }
    }
  }
}

export function isOverflowDefaultBinArrayBitmap(binArrayIndex: BigNumber) {
  const [minBinArrayIndex, maxBinArrayIndex] = internalBitmapRange();
  return (
    binArrayIndex.isGreaterThan(maxBinArrayIndex.toNumber()) ||
    binArrayIndex.isLessThan(minBinArrayIndex.toNumber())
  );
}

function internalBitmapRange() {
  const lowerBinArrayIndex = BIN_ARRAY_BITMAP_SIZE.neg();
  const upperBinArrayIndex = BIN_ARRAY_BITMAP_SIZE.sub(new BN(1));
  return [lowerBinArrayIndex, upperBinArrayIndex];
}

function extensionBitmapRange() {
  return [
    BIN_ARRAY_BITMAP_SIZE.neg().mul(
      EXTENSION_BINARRAY_BITMAP_SIZE.add(new BN(1))
    ),
    BIN_ARRAY_BITMAP_SIZE.mul(
      EXTENSION_BINARRAY_BITMAP_SIZE.add(new BN(1))
    ).sub(new BN(1)),
  ];
}

function findSetBit(
  startIndex: number,
  endIndex: number,
  binArrayBitmapExtension: BinArrayBitmapExtension
): number | null {
  const getBinArrayOffset = (binArrayIndex: BN) =>
    binArrayIndex.gt(new BN(0))
      ? binArrayIndex.mod(BIN_ARRAY_BITMAP_SIZE)
      : binArrayIndex.add(new BN(1)).neg().mod(BIN_ARRAY_BITMAP_SIZE);

  const getBitmapOffset = (binArrayIndex: BN) =>
    binArrayIndex.gt(new BN(0))
      ? binArrayIndex.div(BIN_ARRAY_BITMAP_SIZE).sub(new BN(1))
      : binArrayIndex
          .add(new BN(1))
          .neg()
          .div(BIN_ARRAY_BITMAP_SIZE)
          .sub(new BN(1));

  if (startIndex <= endIndex) {
    for (let i = startIndex; i <= endIndex; i++) {
      const binArrayOffset = getBinArrayOffset(new BN(i)).toNumber();
      const bitmapOffset = getBitmapOffset(new BN(i)).toNumber();
      const bitmapChunks =
        i > 0
          ? binArrayBitmapExtension.positiveBinArrayBitmap[bitmapOffset]
          : binArrayBitmapExtension.negativeBinArrayBitmap[bitmapOffset];
      const bitmap = buildBitmapFromU64Arrays(
        bitmapChunks.map((bN) => new BN(bN.toNumber()))
      );
      if (bitmap.testn(binArrayOffset)) {
        return i;
      }
    }
  } else {
    for (let i = startIndex; i >= endIndex; i--) {
      const binArrayOffset = getBinArrayOffset(new BN(i)).toNumber();
      const bitmapOffset = getBitmapOffset(new BN(i)).toNumber();
      const bitmapChunks =
        i > 0
          ? binArrayBitmapExtension.positiveBinArrayBitmap[bitmapOffset]
          : binArrayBitmapExtension.negativeBinArrayBitmap[bitmapOffset];
      const bitmap = buildBitmapFromU64Arrays(
        bitmapChunks.map((bN) => new BN(bN.toNumber()))
      );
      if (bitmap.testn(binArrayOffset)) {
        return i;
      }
    }
  }

  return null;
}

function buildBitmapFromU64Arrays(u64Arrays: BN[]) {
  const buffer = Buffer.concat(
    u64Arrays.map((b) => b.toArrayLike(Buffer, 'le', 8))
  );

  return new BN(buffer, 'le');
}

function bitmapTypeDetail(type: BitmapType) {
  if (type == BitmapType.U1024) {
    return {
      bits: 1024,
      bytes: 1024 / 8,
    };
  }
  return {
    bits: 512,
    bytes: 512 / 8,
  };
}

function mostSignificantBit(number: BN, bitLength: number) {
  const highestIndex = bitLength - 1;
  if (number.isZero()) {
    return null;
  }

  for (let i = highestIndex; i >= 0; i--) {
    if (number.testn(i)) {
      return highestIndex - i;
    }
  }
  return null;
}

function leastSignificantBit(number: BN, bitLength: number) {
  if (number.isZero()) {
    return null;
  }
  for (let i = 0; i < bitLength; i++) {
    if (number.testn(i)) {
      return i;
    }
  }
  return null;
}

export function findNextBinArrayWithLiquidity(
  swapForY: boolean,
  activeBinId: BN,
  lbPairState: LbPair,
  binArrayBitmapExtension: BinArrayBitmapExtension | null,
  binArrays: ParsedAccount<BinArray>[]
): ParsedAccount<BinArray> | null {
  const nearestBinArrayIndexWithLiquidity = findNextBinArrayIndexWithLiquidity(
    swapForY,
    activeBinId,
    lbPairState,
    binArrayBitmapExtension
  );

  if (nearestBinArrayIndexWithLiquidity == null) {
    return null;
  }

  const binArrayAccount = binArrays.find((ba) =>
    ba.index.eq(nearestBinArrayIndexWithLiquidity.toNumber())
  );
  if (!binArrayAccount) {
    // Cached bin array couldn't cover more bins, partial quoted.
    return null;
  }

  return binArrayAccount;
}

export function isBinIdWithinBinArray(activeId: BN, binArrayIndex: BN) {
  const [lowerBinId, upperBinId] = getBinArrayLowerUpperBinId(
    new BigNumber(binArrayIndex.toNumber())
  );
  return (
    activeId.gte(new BN(lowerBinId.toNumber())) &&
    activeId.lte(new BN(upperBinId.toNumber()))
  );
}

export function getBaseFee(binStep: number, sParameter: StaticParameters) {
  return new BN(sParameter.baseFactor).mul(new BN(binStep)).mul(new BN(10));
}

export function getVariableFee(
  binStep: number,
  sParameter: StaticParameters,
  vParameter: VariableParameters
) {
  if (sParameter.variableFeeControl > 0) {
    const squareVfaBin = new BN(vParameter.volatilityAccumulator)
      .mul(new BN(binStep))
      .pow(new BN(2));
    const vFee = new BN(sParameter.variableFeeControl).mul(squareVfaBin);

    return vFee.add(new BN(99_999_999_999)).div(new BN(100_000_000_000));
  }
  return new BN(0);
}

const MAX_FEE_RATE = new BN(100_000_000);

export function getTotalFee(
  binStep: number,
  sParameter: StaticParameters,
  vParameter: VariableParameters
) {
  const totalFee = getBaseFee(binStep, sParameter).add(
    getVariableFee(binStep, sParameter, vParameter)
  );
  return totalFee.gt(MAX_FEE_RATE) ? MAX_FEE_RATE : totalFee;
}

const FEE_PRECISION = new BN(1_000_000_000);

export function computeFee(
  binStep: number,
  sParameter: StaticParameters,
  vParameter: VariableParameters,
  inAmount: BN
) {
  const totalFee = getTotalFee(binStep, sParameter, vParameter);
  const denominator = FEE_PRECISION.sub(totalFee);

  return inAmount
    .mul(totalFee)
    .add(denominator)
    .sub(new BN(1))
    .div(denominator);
}

export function computeFeeFromAmount(
  binStep: number,
  sParameter: StaticParameters,
  vParameter: VariableParameters,
  inAmountWithFees: BN
) {
  const totalFee = getTotalFee(binStep, sParameter, vParameter);
  return inAmountWithFees
    .mul(totalFee)
    .add(FEE_PRECISION.sub(new BN(1)))
    .div(FEE_PRECISION);
}

export function computeProtocolFee(
  feeAmount: BN,
  sParameter: StaticParameters
) {
  return feeAmount
    .mul(new BN(sParameter.protocolShare))
    .div(new BN(BASIS_POINT_MAX));
}

export function getOutAmount(bin: Bin, inAmount: BN, swapForY: boolean) {
  return swapForY
    ? new BN(
        mulShr(
          inAmount,
          new BN(bin.price.toNumber()),
          SCALE_OFFSET,
          Rounding.Down
        ).toNumber()
      )
    : new BN(
        shlDiv(
          inAmount,
          new BN(bin.price.toNumber()),
          SCALE_OFFSET,
          Rounding.Down
        ).toNumber()
      );
}

export function swapExactInQuoteAtBin(
  bin: Bin,
  binStep: number,
  sParameter: StaticParameters,
  vParameter: VariableParameters,
  inAmount: BN,
  swapForY: boolean
): {
  amountIn: BN;
  amountOut: BN;
  fee: BN;
  protocolFee: BN;
} {
  if (swapForY && bin.amountY.isZero()) {
    return {
      amountIn: new BN(0),
      amountOut: new BN(0),
      fee: new BN(0),
      protocolFee: new BN(0),
    };
  }

  if (!swapForY && bin.amountX.isZero()) {
    return {
      amountIn: new BN(0),
      amountOut: new BN(0),
      fee: new BN(0),
      protocolFee: new BN(0),
    };
  }

  let maxAmountOut: BN;
  let maxAmountIn: BN;

  if (swapForY) {
    maxAmountOut = new BN(bin.amountY.toNumber());
    maxAmountIn = new BN(
      shlDiv(
        new BN(bin.amountY.toNumber()),
        new BN(bin.price.toNumber()),
        SCALE_OFFSET,
        Rounding.Up
      ).toNumber()
    );
  } else {
    maxAmountOut = new BN(bin.amountX.toNumber());
    maxAmountIn = new BN(
      mulShr(
        new BN(bin.amountX.toNumber()),
        new BN(bin.price.toNumber()),
        SCALE_OFFSET,
        Rounding.Up
      ).toNumber()
    );
  }

  const maxFee = computeFee(binStep, sParameter, vParameter, maxAmountIn);
  maxAmountIn = maxAmountIn.add(maxFee);

  let amountInWithFees: BN;
  let amountOut: BN;
  let fee: BN;
  let protocolFee: BN;

  if (inAmount.gt(maxAmountIn)) {
    amountInWithFees = maxAmountIn;
    amountOut = maxAmountOut;
    fee = maxFee;
    protocolFee = computeProtocolFee(maxFee, sParameter);
  } else {
    fee = computeFeeFromAmount(binStep, sParameter, vParameter, inAmount);
    const amountInAfterFee = inAmount.sub(fee);
    const computedOutAmount = getOutAmount(bin, amountInAfterFee, swapForY);

    amountOut = computedOutAmount.gt(maxAmountOut)
      ? maxAmountOut
      : computedOutAmount;
    protocolFee = computeProtocolFee(fee, sParameter);
    amountInWithFees = inAmount;
  }

  return {
    amountIn: amountInWithFees,
    amountOut,
    fee,
    protocolFee,
  };
}

function getNewVolatilityAccumulator(
  vParameter: VariableParameters,
  sParameter: StaticParameters,
  activeId: number
) {
  const deltaId = Math.abs(vParameter.indexReference - activeId);
  const newVolatilityAccumulator =
    vParameter.volatilityReference + deltaId * BASIS_POINT_MAX;

  return Math.min(
    newVolatilityAccumulator,
    sParameter.maxVolatilityAccumulator
  );
}

function getNewReference(
  activeId: number,
  vParameter: VariableParameters,
  sParameter: StaticParameters,
  currentTimestamp: number
): { indexRef: number; volatilityRef: number } {
  const elapsed = currentTimestamp - vParameter.lastUpdateTimestamp.toNumber();
  let newIndexRef = vParameter.indexReference;
  let newVolatRef = vParameter.volatilityReference;

  if (elapsed >= sParameter.filterPeriod) {
    newIndexRef = activeId;
    if (elapsed < sParameter.decayPeriod) {
      const decayedVolatilityReference = Math.floor(
        (vParameter.volatilityAccumulator * sParameter.reductionFactor) /
          BASIS_POINT_MAX
      );
      newVolatRef = decayedVolatilityReference;
    } else {
      newVolatRef = 0;
    }
  }
  return {
    indexRef: newIndexRef,
    volatilityRef: newVolatRef,
  };
}

export function getSwapQuote(
  inAmount: BigNumber,
  swapForY: boolean,
  allowedSlippage: BigNumber,
  lbPair: LbPair,
  binArrays: ParsedAccount<BinArray>[],
  binArrayBitmapExtension?: BinArrayBitmapExtension | null,
  isPartialFill?: boolean
): BigNumber | undefined {
  // TODO: Should we use onchain clock ? Volatile fee rate is sensitive to time. Caching clock might causes the quoted fee off ...
  const currentTimestamp = Date.now() / 1000;
  let inAmountLeft = new BN(inAmount.toNumber());

  const vParameterClone = { ...lbPair.vParameters };
  let activeId = new BN(lbPair.activeId);

  const { binStep } = lbPair;
  const sParameters = lbPair.parameters;

  const { indexRef, volatilityRef } = getNewReference(
    activeId.toNumber(),
    vParameterClone,
    sParameters,
    currentTimestamp
  );
  vParameterClone.indexReference = indexRef;
  vParameterClone.volatilityReference = volatilityRef;

  let startBin: Bin | null = null;
  const binArraysForSwap = new Map();
  let actualOutAmount: BN = new BN(0);
  let feeAmount: BN = new BN(0);

  while (!inAmountLeft.isZero()) {
    const binArrayAccountToSwap = findNextBinArrayWithLiquidity(
      swapForY,
      activeId,
      lbPair,
      binArrayBitmapExtension ?? null,
      binArrays
    );

    if (binArrayAccountToSwap == null) {
      if (isPartialFill) {
        break;
      } else {
        return undefined;
      }
    }

    binArraysForSwap.set(binArrayAccountToSwap.pubkey, true);

    vParameterClone.volatilityAccumulator = getNewVolatilityAccumulator(
      vParameterClone,
      sParameters,
      activeId.toNumber()
    );

    if (
      isBinIdWithinBinArray(
        activeId,
        new BN(binArrayAccountToSwap.index.toNumber())
      )
    ) {
      const bin = getBinFromBinArray(
        activeId.toNumber(),
        binArrayAccountToSwap
      );
      const { amountIn, amountOut, fee } = swapExactInQuoteAtBin(
        bin,
        binStep,
        sParameters,
        vParameterClone,
        new BN(inAmountLeft.toNumber()),
        swapForY
      );

      if (!amountIn.isZero()) {
        inAmountLeft = inAmountLeft.sub(amountIn);
        actualOutAmount = actualOutAmount.add(amountOut);
        feeAmount = feeAmount.add(fee);

        if (!startBin) {
          startBin = bin;
        }
      }
    }

    if (!inAmountLeft.isZero()) {
      if (swapForY) {
        activeId = activeId.sub(new BN(1));
      } else {
        activeId = activeId.add(new BN(1));
      }
    }
  }

  if (!startBin) {
    // The pool insufficient liquidity
    return undefined;
  }

  return new BigNumber(actualOutAmount.toNumber());
}
