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
} from '../types';
import { Bin, BinArray, DLMMPosition, LbPair } from './structs';
import { dlmmProgramId } from '../constants';
import { toBN } from '../../../utils/misc/toBN';

export const MAX_BIN_ARRAY_SIZE = new BN(70);
export const SCALE_OFFSET = 64;
export const BASIS_POINT_MAX = 10000;

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
