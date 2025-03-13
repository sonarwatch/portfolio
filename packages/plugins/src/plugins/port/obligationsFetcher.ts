import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  apyToApr,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId } from './constants';
import { ReserveEnhanced } from './types';
import { getParsedProgramAccounts } from '../../utils/solana';
import { obligationStruct } from './structs';
import { getClientSolana } from '../../utils/clients';
import { obligationsFilter } from './filters';
import { parseDataflat, parseApy } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import { wadsDecimal } from '../save/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const obligations = await getParsedProgramAccounts(
    client,
    obligationStruct,
    programId,
    obligationsFilter(owner)
  );
  if (obligations.length === 0) return [];

  const reservesInfo = await cache.getItems<ReserveEnhanced[]>(
    obligations.map((o) => o.lendingMarket.toString()),
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  if (!reservesInfo) throw new Error('Reserves not cached');

  const allReserves = reservesInfo.flat();
  const reservesByMarket: Map<string, ReserveEnhanced[]> = new Map();
  obligations.forEach((obli, index) => {
    const reserves = reservesInfo[index];
    if (reserves) reservesByMarket.set(obli.lendingMarket.toString(), reserves);
  });

  const reserveByAddress: Map<string, ReserveEnhanced> = new Map();
  for (const market of reservesByMarket.keys()) {
    const reserves = reservesByMarket.get(market);
    if (!reserves) continue;
    reserves.forEach((res) => reserveByAddress.set(res.pubkey, res));
  }

  const tokenPriceById = await getTokenPricesMap(
    allReserves
      .map((reserves) => (reserves ? reserves.liquidity.mintPubkey : []))
      .flat(),
    NetworkId.solana,
    cache
  );
  const elements: PortfolioElement[] = [];

  for (const obligation of obligations) {
    const reserves = reservesByMarket.get(obligation.lendingMarket.toString());
    if (!reserves) continue;

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

    for (let j = 0; j < reserves.length; j += 1) {
      const { pubkey: reserveAddress } = reserves[j];
      const reserve = reserveByAddress.get(reserveAddress);
      if (!reserve) continue;

      const { liquidity, collateral } = reserve;
      const lMint = liquidity.mintPubkey;
      const lTokenPrice = tokenPriceById.get(lMint);
      if (!lTokenPrice) continue;

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

          const apy = parseApy(reserve.depositApy);
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
              lTokenPrice
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

          const apy = parseApy(reserve.borrowApy);
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
              lTokenPrice
            )
          );
        }
      }
    }
    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
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
};

const fetcher: Fetcher = {
  id: `${platformId}-obligations`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
