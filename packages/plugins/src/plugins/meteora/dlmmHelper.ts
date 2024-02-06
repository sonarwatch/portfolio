import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import BigNumber from 'bignumber.js';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import {
  BinLiquidity,
  LMRewards,
  PositionBinData,
  PositionData,
  PositionVersion,
} from './types';
import { Bin, BinArray, DLMMPosition, LbPair, binArrayStruct } from './struct';

export const MAX_BIN_ARRAY_SIZE = new BN(70);
export const SCALE_OFFSET = 64;
export const BASIS_POINT_MAX = 10000;

export function binIdToBinArrayIndex(binId: BigNumber): BigNumber {
  const tempBinId = new BN(binId.toString());
  const { div: idx, mod } = tempBinId.divmod(MAX_BIN_ARRAY_SIZE);
  const returnVal =
    tempBinId.isNeg() && !mod.isZero() ? idx.sub(new BN(1)) : idx;
  return new BigNumber(returnVal.toString());
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
  index: BigNumber,
  programId: PublicKey
) {
  const indexTemp = new BN(index.toString());
  let binArrayBytes: Uint8Array;
  if (indexTemp.isNeg()) {
    binArrayBytes = new Uint8Array(indexTemp.toTwos(64).toBuffer('le', 8));
  } else {
    binArrayBytes = new Uint8Array(indexTemp.toBuffer('le', 8));
  }
  return PublicKey.findProgramAddressSync(
    [Buffer.from('bin_array'), lbPair.toBytes(), binArrayBytes],
    programId
  );
}

export async function processPosition(
  program: PublicKey,
  version: PositionVersion,
  lbPair: LbPair,
  onChainTimestamp: number,
  position: DLMMPosition,
  baseTokenDecimal: number,
  quoteTokenDecimal: number,
  lowerBinArray: BinArray,
  upperBinArray: BinArray
): Promise<PositionData | null> {
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
  if (
    bins[0].binId !== lowerBinId ||
    bins[bins.length - 1].binId !== upperBinId
  )
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
    console.log('bins.forEach ~ totalXAmount:', totalXAmount.toNumber());
    totalYAmount = totalYAmount.add(positionYAmount);
    console.log('bins.forEach ~ totalYAmount:', totalYAmount.toNumber());

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

  const { rewardOne, rewardTwo } = await getClaimableLMReward(
    program,
    version,
    lbPair,
    onChainTimestamp,
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

export async function getClaimableLMReward(
  program: PublicKey,
  positionVersion: PositionVersion,
  lbPair: LbPair,
  onChainTimestamp: number,
  position: DLMMPosition,
  lowerBinArray?: BinArray,
  upperBinArray?: BinArray
): Promise<LMRewards> {
  const client = getClientSolana();
  let lowerBinArrayIdx = binIdToBinArrayIndex(
    new BigNumber(position.lowerBinId)
  );

  const rewards = [new BigNumber(0), new BigNumber(0)];

  let tempLowerBinArray: BinArray | undefined | null = lowerBinArray;
  let tempUpperBinArray: BinArray | undefined | null = upperBinArray;
  if (!lowerBinArray || !upperBinArray) {
    lowerBinArrayIdx = binIdToBinArrayIndex(new BigNumber(position.lowerBinId));
    const [newlowerBinArray] = deriveBinArray(
      position.lbPair,
      lowerBinArrayIdx,
      program
    );

    const upperBinArrayIdx = lowerBinArrayIdx.plus(new BigNumber(1));
    const [newupperBinArray] = deriveBinArray(
      position.lbPair,
      upperBinArrayIdx,
      program
    );

    [tempLowerBinArray, tempUpperBinArray] =
      await getParsedMultipleAccountsInfo(client, binArrayStruct, [
        newlowerBinArray,
        newupperBinArray,
      ]);
  }

  if (!tempLowerBinArray || !tempUpperBinArray)
    throw new Error('BinArray not found');

  for (let i = position.lowerBinId; i <= position.upperBinId; i++) {
    const binArrayIdx = binIdToBinArrayIndex(new BigNumber(i));
    const binArray = binArrayIdx.eq(lowerBinArrayIdx)
      ? tempLowerBinArray
      : tempUpperBinArray;
    const binState = getBinFromBinArray(i, binArray);
    const binIdxInPosition = i - position.lowerBinId;

    const positionRewardInfo = position.rewardInfos[binIdxInPosition];
    const liquidityShare =
      positionVersion === PositionVersion.V1
        ? position.liquidityShares[binIdxInPosition]
        : position.liquidityShares[binIdxInPosition].shiftedBy(64);

    for (let j = 0; j < 2; j++) {
      const pairRewardInfo = lbPair.rewardInfos[j];

      if (!pairRewardInfo.mint.equals(PublicKey.default)) {
        let rewardPerTokenStored =
          j === 0
            ? binState.rewardPerTokenXStored
            : binState.rewardPerTokenYStored;

        if (i === lbPair.activeId && !binState.liquiditySupply.isZero()) {
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
          delta,
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

export function getBinFromBinArray(binId: number, binArray: BinArray): Bin {
  const [lowerBinId, upperBinId] = getBinArrayLowerUpperBinId(binArray.index);

  let index = 0;
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

export function mulShr(
  x: BigNumber,
  y: BigNumber,
  offset: number,
  rounding: Rounding
) {
  const denominator = new BigNumber(1).shiftedBy(-offset);
  return mulDiv(x, y, denominator, rounding);
}

export function shlDiv(
  x: BigNumber,
  y: BigNumber,
  offset: number,
  rounding: Rounding
) {
  const scale = new BigNumber(1).shiftedBy(-offset);
  return mulDiv(x, scale, y, rounding);
}

export function mulDiv(
  x: BigNumber,
  y: BigNumber,
  denominator: BigNumber,
  rounding: Rounding
) {
  const { div, mod } = new BN(x.toString())
    .mul(new BN(y.toString()))
    .divmod(new BN(denominator.toString()));

  if (rounding === Rounding.Up && !mod.isZero()) {
    return new BigNumber(div.add(new BN(1)).toString());
  }
  return new BigNumber(div.toString());
}

export function getPriceOfBinByBinId(binStep: number, binId: number): string {
  const binStepNum = new Decimal(binStep).div(new Decimal(BASIS_POINT_MAX));
  return new Decimal(1)
    .add(new Decimal(binStepNum))
    .pow(new Decimal(binId))
    .toString();
}
