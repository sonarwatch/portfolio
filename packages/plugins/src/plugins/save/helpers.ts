import { uniformFixedSizeArray } from '@metaplex-foundation/beet';
import {
  NetworkId,
  PortfolioElement,
  Yield,
  apyToApr,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  Obligation,
  obligationCollateralStruct,
  obligationLiquidityStruct,
} from './structs';
import { ParsedAccount } from '../../utils/solana';
import { MarketInfo, ReserveInfo } from './types';
import { pid, platformDumpyId, platformId, wadsDecimal } from './constants';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { Cache } from '../../Cache';

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

export async function getElementsFromObligations(
  obligations: ParsedAccount<Obligation>[],
  reserveByAddress: Map<string, ReserveInfo>,
  marketByAddress: Map<string, MarketInfo>,
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> {
  const obligationAddressesRelatedToSavePlatform =
    await getObligationAddressesRelatedToSavePlatform(owner, marketByAddress);

  const elementRegistrySave = new ElementRegistry(NetworkId.solana, platformId);
  const elementRegistryDumpy = new ElementRegistry(
    NetworkId.solana,
    platformDumpyId
  );

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
    const element = obligationAddressesRelatedToSavePlatform?.includes(
      obligation.pubkey.toString()
    )
      ? elementRegistrySave.addElementBorrowlend({
          label: 'Lending',
          name: market.name,
          ref: obligation.pubkey.toString(),
          sourceRefs: [{ name: 'Lending Market', address: market.address }],
          link: `https://save.finance/dashboard?pool=${market.address}`,
        })
      : elementRegistryDumpy.addElementBorrowlend({
          label: 'Lending',
          ref: obligation.pubkey.toString(),
          sourceRefs: [{ name: 'Lending Market', address: market.address }],
        });

    for (let j = 0; j < market.reserves.length; j += 1) {
      const { address: reserveAddress } = market.reserves[j];
      const reserveInfo = reserveByAddress.get(reserveAddress);
      if (!reserveInfo) continue;

      const { reserve } = reserveInfo;
      const { liquidity, collateral } = reserve;
      const lMint = liquidity.mintPubkey;

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

          element.addSuppliedLtv(reserve.config.liquidationThreshold / 100);

          const apy = +reserveInfo.rates.supplyInterest / 100;
          const cSuppliedYields: Yield[] = [
            {
              apr: apyToApr(apy),
              apy,
            },
          ];

          element.addSuppliedYield(cSuppliedYields);
          element.addSuppliedAsset({
            address: lMint,
            amount: suppliedAmount,
            alreadyShifted: true,
          });
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

          element.addBorrowedWeight(
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
          element.addBorrowedYield(cBorrowedYields);
          element.addBorrowedAsset({
            address: lMint,
            amount: borrowedAmount,
            alreadyShifted: true,
          });
        }
      }
    }
  }

  const dumpyElements = await elementRegistryDumpy.getElements(cache);
  const saveElements = await elementRegistrySave.getElements(cache);

  return [...dumpyElements, ...saveElements];
}

const getObligationAddressesRelatedToSavePlatform = async (
  owner: string,
  marketsByAddress: Map<string, MarketInfo>
) => {
  const obligationAddressesRelatedToSavePlatform: string[] = [];
  for (const marketInfo of marketsByAddress.values()) {
    if (!marketInfo) continue;
    const seeds = [
      getObligationSeed(marketInfo.address, 0),
      getObligationSeed(marketInfo.address, 1),
      getObligationSeed(marketInfo.address, 2),
    ];
    for (let i = 0; i < seeds.length; i += 1) {
      const seed = seeds[i];
      const obligationAddress = await PublicKey.createWithSeed(
        new PublicKey(owner),
        seed,
        pid
      );
      obligationAddressesRelatedToSavePlatform.push(
        obligationAddress.toString()
      );
    }
  }
  return obligationAddressesRelatedToSavePlatform;
};
