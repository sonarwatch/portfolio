import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { SpotBalanceType, SpotMarket, SpotPosition } from './struct';

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);
export const TEN = new BigNumber(10);
export const QUOTE_SPOT_MARKET_INDEX = 0;
export const SPOT_MARKET_UTILIZATION_PRECISION_EXP = new BigNumber(6);
export const SPOT_MARKET_UTILIZATION_PRECISION = new BigNumber(10).pow(
  SPOT_MARKET_UTILIZATION_PRECISION_EXP
);
export const SPOT_MARKET_RATE_PRECISION_EXP = new BigNumber(6);
export const SPOT_MARKET_RATE_PRECISION = new BigNumber(10).pow(
  SPOT_MARKET_RATE_PRECISION_EXP
);
export const PERCENTAGE_PRECISION_EXP = new BigNumber(6);
export const PERCENTAGE_PRECISION = new BigNumber(10).pow(
  PERCENTAGE_PRECISION_EXP
);
export const CONCENTRATION_PRECISION = PERCENTAGE_PRECISION;

export const divCeil = (a: BigNumber, b: BigNumber): BigNumber => {
  const quotient = a.div(b);

  const remainder = a.mod(b);

  if (remainder.gt(ZERO)) {
    return quotient.plus(ONE);
  }
  return quotient;
};

export function getTokenAmount(
  scaleBalance: BigNumber,
  spotMarket: SpotMarket,
  balanceType: SpotBalanceType
): BigNumber {
  const precisionDecrease = TEN.pow(new BigNumber(19 - spotMarket.decimals));

  if (balanceType === SpotBalanceType.Deposit) {
    return scaleBalance
      .multipliedBy(spotMarket.cumulativeDepositInterest)
      .div(precisionDecrease.toNumber());
  }
  return divCeil(
    scaleBalance.multipliedBy(spotMarket.cumulativeBorrowInterest),
    precisionDecrease
  );
}

export function getSignedTokenAmount(
  tokenAmount: BigNumber,
  balanceType: SpotBalanceType
): BigNumber {
  if (balanceType === SpotBalanceType.Deposit) {
    return tokenAmount;
  }
  return tokenAmount.abs().negated();
}

export function calculateUtilization(
  bank: SpotMarket,
  delta = ZERO
): BigNumber {
  let tokenDepositAmount = getTokenAmount(
    bank.depositBalance,
    bank,
    SpotBalanceType.Deposit
  );
  let tokenBorrowAmount = getTokenAmount(
    bank.borrowBalance,
    bank,
    SpotBalanceType.Borrow
  );

  if (delta.gt(ZERO)) {
    tokenDepositAmount = tokenDepositAmount.plus(delta);
  } else if (delta.lt(ZERO)) {
    tokenBorrowAmount = tokenBorrowAmount.plus(delta.abs());
  }

  let utilization: BigNumber;
  if (tokenBorrowAmount.eq(ZERO) && tokenDepositAmount.eq(ZERO)) {
    utilization = ZERO;
  } else if (tokenDepositAmount.eq(ZERO)) {
    utilization = SPOT_MARKET_UTILIZATION_PRECISION;
  } else {
    utilization = tokenBorrowAmount
      .multipliedBy(SPOT_MARKET_UTILIZATION_PRECISION)
      .div(tokenDepositAmount);
  }

  return utilization;
}

export function calculateBorrowRate(bank: SpotMarket): BigNumber {
  return calculateInterestRate(bank).div(SPOT_MARKET_UTILIZATION_PRECISION);
}

export function calculateDepositRate(bank: SpotMarket): BigNumber {
  const utilization = calculateUtilization(bank);
  const borrowRate = calculateBorrowRate(bank);
  const depositRate = borrowRate
    .multipliedBy(
      PERCENTAGE_PRECISION.minus(new BigNumber(bank.insuranceFund.totalFactor))
    )
    .multipliedBy(utilization)
    .div(SPOT_MARKET_UTILIZATION_PRECISION)
    .div(PERCENTAGE_PRECISION);
  return depositRate;
}

export function calculateInterestRate(
  bank: SpotMarket,
  delta = ZERO
): BigNumber {
  const utilization = calculateUtilization(bank, delta);

  const optimalUtil = new BigNumber(bank.optimalUtilization);
  const optimalRate = new BigNumber(bank.optimalBorrowRate);
  const maxRate = new BigNumber(bank.maxBorrowRate);
  const minRate = new BigNumber(bank.minBorrowRate).multipliedBy(
    PERCENTAGE_PRECISION.div(200)
  );

  const weightsDivisor = new BigNumber(1000);
  const segments: [BigNumber, BigNumber][] = [
    [new BigNumber(850_000), new BigNumber(50)],
    [new BigNumber(900_000), new BigNumber(100)],
    [new BigNumber(950_000), new BigNumber(150)],
    [new BigNumber(990_000), new BigNumber(200)],
    [new BigNumber(995_000), new BigNumber(250)],
    [SPOT_MARKET_UTILIZATION_PRECISION, new BigNumber(250)],
  ];

  let rate: BigNumber;
  if (utilization.lte(optimalUtil)) {
    // below optimal: linear ramp from 0 to optimalRate
    const slope = optimalRate
      .multipliedBy(SPOT_MARKET_UTILIZATION_PRECISION)
      .div(optimalUtil);
    rate = utilization
      .multipliedBy(slope)
      .div(SPOT_MARKET_UTILIZATION_PRECISION);
  } else {
    // above optimal: piecewise segments
    const totalExtraRate = maxRate.minus(optimalRate);

    rate = new BigNumber(optimalRate);
    let prevUtil = BigNumber(optimalUtil);

    for (const [bp, weight] of segments) {
      const segmentEnd = bp.gt(SPOT_MARKET_UTILIZATION_PRECISION)
        ? SPOT_MARKET_UTILIZATION_PRECISION
        : bp;
      const segmentRange = segmentEnd.minus(prevUtil);

      const segmentRateTotal = totalExtraRate
        .multipliedBy(weight)
        .div(weightsDivisor);

      if (utilization.lte(segmentEnd)) {
        const partialUtil = utilization.minus(prevUtil);
        const partialRate = segmentRateTotal
          .multipliedBy(partialUtil)
          .div(segmentRange);
        rate = rate.plus(partialRate);
        break;
      } else {
        rate = rate.plus(segmentRateTotal);
        prevUtil = segmentEnd;
      }
    }
  }

  return BigNumber.max(minRate, rate);
}

export function isSpotPositionAvailable(position: SpotPosition): boolean {
  return position.scaledBalance.eq(ZERO) && position.openOrders === 0;
}

export function getUserAccountPublicKey(
  programId: PublicKey,
  owner: PublicKey,
  subAccountId: number
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('user', 'utf8'),
      owner.toBuffer(),
      new BN(subAccountId).toArrayLike(Buffer, 'le', 2),
    ],
    programId
  )[0];
}

export function getUserMainAccountPublicKey(
  programId: PublicKey,
  owner: PublicKey
) {
  return getUserAccountPublicKey(programId, owner, 0);
}

export function getUserAccountsPublicKeys(
  programId: PublicKey,
  owner: PublicKey,
  startId: number,
  endId: number
): PublicKey[] {
  const keys = [];
  for (let i = startId; i < endId; i++) {
    keys.push(
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('user', 'utf8'),
          owner.toBuffer(),
          new BN(i).toArrayLike(Buffer, 'le', 2),
        ],
        programId
      )[0]
    );
  }
  return keys;
}

export function getUserInsuranceFundStakeAccountPublicKey(
  programId: PublicKey,
  owner: PublicKey,
  marketIndex: number
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('insurance_fund_stake', 'utf8'),
      owner.toBuffer(),
      new BN(marketIndex).toArrayLike(Buffer, 'le', 2),
    ],
    programId
  )[0];
}
