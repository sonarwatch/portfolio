import { uniformFixedSizeArray } from '@metaplex-foundation/beet';
import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  apyToApr,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  Obligation,
  obligationCollateralStruct,
  obligationLiquidityStruct,
} from './structs';
import { ParsedAccount } from '../../utils/solana';
import { MarketInfo, ReserveInfo } from './types';
import { platformId, wadsDecimal } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { parsePriceData } from '../../utils/solana/pyth/helpers';

export const upperFirst = (string: string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

export function getObligationSeed(marketAddress: string, accountId: number) {
  if (accountId === 0) return marketAddress.slice(0, 32);
  // <first 25 char of lending market address> + <7 chars: 0000001 - 9999999>
  return marketAddress.slice(0, 25) + `0000000${accountId}`.slice(-7);
}

export const parseDataflat = (
  dataFlat: Buffer,
  depositsLen: number,
  borrowsLen: number
) => {
  const obligationCollateralArray = uniformFixedSizeArray(
    obligationCollateralStruct,
    depositsLen
  );
  const deposits = obligationCollateralArray.read(dataFlat, 0);
  const depositsMap = new Map(
    deposits.map((i) => [i.depositReserve.toString(), i])
  );

  const obligationLiquidityArray = uniformFixedSizeArray(
    obligationLiquidityStruct,
    borrowsLen
  );
  const borrows = obligationLiquidityArray.read(
    dataFlat,
    obligationCollateralArray.byteSize
  );
  const borrowsMap = new Map(
    borrows.map((i) => [i.borrowReserve.toString(), i])
  );
  return {
    deposits,
    depositsMap,
    borrows,
    borrowsMap,
  };
};

export function getElementsFromObligations(
  obligations: ParsedAccount<Obligation>[],
  reserveByAddress: Map<string, ReserveInfo>,
  marketByAddress: Map<string, MarketInfo>,
  tokenPriceByAddress: Map<string, TokenPrice>,
  pythAccountByAddress: Map<string, AccountInfo<Buffer>>
): PortfolioElement[] {
  const elements: PortfolioElement[] = [];
  for (let i = 0; i < obligations.length; i += 1) {
    const obligation = obligations[i];
    if (!obligation) continue;

    const market = marketByAddress.get(obligation.lendingMarket.toString());
    if (!market) continue;

    const { depositsMap, borrowsMap } = parseDataflat(
      obligation.dataFlat,
      obligation.depositsLen,
      obligation.borrowsLen
    );
    if (depositsMap.size === 0 && borrowsMap.size === 0) continue;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const suppliedLtvs: number[] = [];
    const borrowedWeights: number[] = [];

    for (let j = 0; j < market.reserves.length; j += 1) {
      const { address: reserveAddress } = market.reserves[j];
      const reserveInfo = reserveByAddress.get(reserveAddress);
      if (!reserveInfo) continue;

      const { reserve } = reserveInfo;
      const { liquidity, collateral } = reserve;
      const lMint = liquidity.mintPubkey;
      const lTokenPrice = tokenPriceByAddress.get(lMint);
      let price: number | undefined;
      if (!lTokenPrice) {
        continue;
        // const pythOracle = new PublicKey(reserve.liquidity.pythOracle);
        // const pythAccount = pythAccountByAddress.get(pythOracle.toString());
        // console.log('Account', pythAccount?.data.byteLength);
        // const pythPrice = pythAccount
        //   ? parsePriceData(pythAccount.data)
        //   : undefined;
        // if (pythPrice) price = pythPrice.price;
      }

      const decimals = liquidity.mintDecimals;
      const reserveBorrowAmount = new BigNumber(liquidity.borrowedAmountWads)
        .dividedBy(10 ** (wadsDecimal + decimals))
        .toNumber();
      const reserveAvailableAmount = new BigNumber(liquidity.availableAmount)
        .dividedBy(10 ** decimals)
        .toNumber();
      const collateralSupply = new BigNumber(collateral.mintTotalSupply)
        .dividedBy(10 ** decimals)
        .toNumber();
      const reserveDepositAmount = reserveBorrowAmount + reserveAvailableAmount;

      // Deposit
      const deposit = depositsMap.get(reserveAddress);
      if (deposit) {
        if (!deposit.depositedAmount.isZero()) {
          const suppliedAmount = deposit.depositedAmount
            .div(10 ** decimals)
            .times(reserveDepositAmount / collateralSupply)
            .toNumber();

          suppliedLtvs.push(reserve.config.liquidationThreshold / 100);

          const apy = +reserveInfo.rates.supplyInterest / 100;
          const cSuppliedYields: Yield[] = [
            {
              apr: apyToApr(apy),
              apy,
            },
          ];
          suppliedYields.push(cSuppliedYields);
          suppliedAssets.push(
            tokenPriceToAssetToken(
              lMint,
              suppliedAmount,
              NetworkId.solana,
              lTokenPrice,
              price
            )
          );
        }
      }

      // Borrow
      const borrow = borrowsMap.get(reserveAddress);
      if (borrow) {
        if (!borrow.borrowedAmountWads.isZero()) {
          const borrowedAmount = borrow.borrowedAmountWads
            .times(new BigNumber(liquidity.cumulativeBorrowRateWads))
            .div(borrow.cumulativeBorrowRateWads)
            .dividedBy(new BigNumber(10 ** (wadsDecimal + decimals)))
            .toNumber();

          borrowedWeights.push(
            new BigNumber(reserve.config.addedBorrowWeightBPS)
              .dividedBy(10 ** 4)
              .plus(1)
              .toNumber()
          );

          const apy = +reserveInfo.rates.borrowInterest / 100;
          const cBorrowedYields: Yield[] = [
            {
              apr: -apyToApr(apy),
              apy: -apy,
            },
          ];
          borrowedYields.push(cBorrowedYields);
          borrowedAssets.push(
            tokenPriceToAssetToken(
              lMint,
              borrowedAmount,
              NetworkId.solana,
              lTokenPrice,
              price
            )
          );
        }
      }
    }
    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
        suppliedLtvs,
        borrowedWeights,
      });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
      name: market.name,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
    });
  }
  return elements;
}
