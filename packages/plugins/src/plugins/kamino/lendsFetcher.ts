import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  aprToApy,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  lendingConfigs,
  marketsKey,
  platformId,
  reservesKey,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getClientSolana } from '../../utils/clients';
import { obligationStruct } from './structs/klend';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ReserveDataEnhanced } from './types';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import {
  getLendingPda,
  getLeveragePdas,
  getMultiplyPdas,
} from './helpers/pdas';

const zeroAdressValue = '11111111111111111111111111111111';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const networkId = NetworkId.solana;

  const markets = await cache.getItem<string[]>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  const [lendingPdas, multiplyPdas] = markets
    ? [getLendingPda(owner, markets), getMultiplyPdas(owner, markets)]
    : [[], []];

  const leveragePdas = getLeveragePdas(owner);

  const obligations = await getParsedMultipleAccountsInfo(
    client,
    obligationStruct,
    [...lendingPdas, ...multiplyPdas, ...leveragePdas]
  );

  if (!obligations.some((obli) => obli !== null)) return [];

  const lendingAccounts = obligations.slice(0, lendingPdas.length);

  const multiplyAccounts = obligations.slice(
    lendingPdas.length,
    lendingPdas.length + multiplyPdas.length
  );

  const leverageAccounts = obligations.slice(
    lendingPdas.length + multiplyPdas.length,
    obligations.length
  );

  if (!lendingAccounts && !multiplyAccounts && !leverageAccounts) return [];

  const reserves = await cache.getItem<Record<string, ReserveDataEnhanced>>(
    reservesKey,
    {
      prefix: platformId,
      networkId,
    }
  );
  if (!reserves) return [];

  const tokenAddresses = Object.entries(reserves).map((entry) =>
    reserves[entry[0]].liquidity.mintPubkey.toString()
  );

  const tokensPrices = await cache.getTokenPrices(tokenAddresses, networkId);
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokensPrices.forEach((tP) => (tP ? tokenPriceById.set(tP.address, tP) : []));

  const elements: PortfolioElement[] = [];

  // *************
  // KLend : https://app.kamino.finance/lending
  // *************

  if (lendingAccounts) {
    for (const lendingAccount of lendingAccounts) {
      if (!lendingAccount) continue;
      const lendingConfig = lendingConfigs.get(
        lendingAccount.lendingMarket.toString()
      );
      const borrowedAssets: PortfolioAsset[] = [];
      const borrowedYields: Yield[][] = [];
      const suppliedAssets: PortfolioAsset[] = [];
      const suppliedYields: Yield[][] = [];
      const rewardAssets: PortfolioAsset[] = [];
      const suppliedLtvs: number[] = [];
      const borrowedWeights: number[] = [];
      for (const deposit of lendingAccount.deposits) {
        if (
          deposit.depositReserve.toString() === zeroAdressValue ||
          deposit.depositedAmount.isLessThanOrEqualTo(0)
        )
          continue;

        const amountRaw = deposit.depositedAmount;
        const reserve = reserves[deposit.depositReserve.toString()];
        if (!reserve) continue;

        const mint = reserve.liquidity.mintPubkey;
        const tokenPrice = tokenPriceById.get(mint);
        const amount = amountRaw
          .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
          .dividedBy(reserve.exchangeRate)
          .toNumber();
        suppliedAssets.push(
          tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
        );
        suppliedLtvs.push(reserve.config.liquidationThresholdPct / 100);
        suppliedYields.push([
          { apr: reserve.supplyApr, apy: aprToApy(reserve.supplyApr) },
        ]);
      }

      for (const borrow of lendingAccount.borrows) {
        if (
          borrow.borrowReserve.toString() === zeroAdressValue ||
          borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
        )
          continue;
        const amountRaw = borrow.borrowedAmountSf.dividedBy(
          borrow.cumulativeBorrowRateBsf.value0
        );
        const reserve = reserves[borrow.borrowReserve.toString()];
        if (!reserve) continue;

        const mint = reserve.liquidity.mintPubkey;
        const tokenPrice = tokenPriceById.get(mint);
        const amount = amountRaw
          .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
          .toNumber();
        borrowedAssets.push(
          tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
        );
        borrowedWeights.push(Number(reserve.config.borrowFactorPct) / 100);
        borrowedYields.push([
          { apr: -reserve.borrowApr, apy: -aprToApy(reserve.borrowApr) },
        ]);
      }

      if (suppliedAssets.length !== 0 || borrowedAssets.length !== 0) {
        const {
          borrowedValue,
          suppliedValue,
          value,
          healthRatio,
          rewardValue,
        } = getElementLendingValues(
          suppliedAssets,
          borrowedAssets,
          rewardAssets,
          suppliedLtvs,
          borrowedWeights
        );

        elements.push({
          type: PortfolioElementType.borrowlend,
          networkId,
          platformId,
          label: 'Lending',
          name: lendingConfig?.name,
          value,
          data: {
            borrowedAssets,
            borrowedValue,
            borrowedYields,
            suppliedAssets,
            suppliedValue,
            suppliedYields,
            collateralRatio: null,
            healthRatio,
            rewardAssets,
            rewardValue,
            value,
          },
        });
      }
    }
  }

  // ******
  // Multiply :  https://app.kamino.finance/lending/multiply
  // ******

  if (multiplyAccounts)
    for (const multiplyAccount of multiplyAccounts) {
      if (!multiplyAccount) continue;

      const lendingConfig = lendingConfigs.get(
        multiplyAccount.lendingMarket.toString()
      );
      const name = lendingConfig
        ? `Multiply ${lendingConfig.name}`
        : 'Multiply';

      const borrowedAssets: PortfolioAsset[] = [];
      const borrowedYields: Yield[][] = [];
      const suppliedAssets: PortfolioAsset[] = [];
      const suppliedYields: Yield[][] = [];
      const rewardAssets: PortfolioAsset[] = [];
      const suppliedLtvs: number[] = [];
      const borrowedWeights: number[] = [];

      for (const deposit of multiplyAccount.deposits) {
        if (
          deposit.depositReserve.toString() === zeroAdressValue ||
          deposit.depositedAmount.isLessThanOrEqualTo(0)
        )
          continue;

        const amountRaw = deposit.depositedAmount;
        const reserve = reserves[deposit.depositReserve.toString()];
        if (!reserve) continue;

        const mint = reserve.liquidity.mintPubkey;
        const tokenPrice = tokenPriceById.get(mint);
        const amount = amountRaw
          .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
          .dividedBy(reserve.exchangeRate)
          .toNumber();
        suppliedAssets.push(
          tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
        );
        suppliedLtvs.push(reserve.config.liquidationThresholdPct / 100);
        suppliedYields.push([
          { apr: reserve.supplyApr, apy: aprToApy(reserve.supplyApr) },
        ]);
      }
      for (const borrow of multiplyAccount.borrows) {
        if (
          borrow.borrowReserve.toString() === zeroAdressValue ||
          borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
        )
          continue;

        const amountRaw = borrow.borrowedAmountSf.dividedBy(
          borrow.cumulativeBorrowRateBsf.value0
        );
        const reserve = reserves[borrow.borrowReserve.toString()];
        if (!reserve) continue;

        const mint = reserve.liquidity.mintPubkey;
        const tokenPrice = tokenPriceById.get(mint);
        const amount = amountRaw
          .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
          .toNumber();
        borrowedAssets.push(
          tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
        );
        borrowedWeights.push(Number(reserve.config.borrowFactorPct) / 100);
        borrowedYields.push([
          { apr: -reserve.borrowApr, apy: -aprToApy(reserve.borrowApr) },
        ]);
      }

      if (suppliedAssets.length !== 0 || borrowedAssets.length !== 0) {
        const { borrowedValue, suppliedValue, value, rewardValue } =
          getElementLendingValues(
            suppliedAssets,
            borrowedAssets,
            rewardAssets,
            suppliedLtvs,
            borrowedWeights
          );

        elements.push({
          type: PortfolioElementType.borrowlend,
          networkId,
          platformId,
          label: 'Lending',
          name,
          value,
          data: {
            borrowedAssets,
            borrowedValue,
            borrowedYields,
            suppliedAssets,
            suppliedValue,
            suppliedYields,
            healthRatio: null,
            collateralRatio: null,

            rewardAssets,
            rewardValue,
            value,
          },
        });
      }
    }

  // ******
  // Leverage :  https://app.kamino.finance/lending/leverage
  // ******

  for (const leverageAccount of leverageAccounts) {
    if (!leverageAccount) continue;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const suppliedLtvs: number[] = [];
    const borrowedWeights: number[] = [];

    for (const deposit of leverageAccount.deposits) {
      if (
        deposit.depositReserve.toString() === zeroAdressValue ||
        deposit.depositedAmount.isLessThanOrEqualTo(0)
      )
        continue;

      const amountRaw = deposit.depositedAmount;
      const reserve = reserves[deposit.depositReserve.toString()];
      if (!reserve) continue;

      const mint = reserve.liquidity.mintPubkey;
      const tokenPrice = tokenPriceById.get(mint);
      const amount = amountRaw
        .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
        .dividedBy(reserve.exchangeRate)
        .toNumber();
      suppliedAssets.push(
        tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
      );
      suppliedLtvs.push(reserve.config.liquidationThresholdPct / 100);
      suppliedYields.push([
        { apr: reserve.supplyApr, apy: aprToApy(reserve.supplyApr) },
      ]);
    }
    for (const borrow of leverageAccount.borrows) {
      if (
        borrow.borrowReserve.toString() === zeroAdressValue ||
        borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
      )
        continue;

      const amountRaw = borrow.borrowedAmountSf.dividedBy(
        borrow.cumulativeBorrowRateBsf.value0
      );
      const reserve = reserves[borrow.borrowReserve.toString()];
      if (!reserve) continue;

      const mint = reserve.liquidity.mintPubkey;
      const tokenPrice = tokenPriceById.get(mint);
      const amount = amountRaw
        .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
        .toNumber();
      borrowedAssets.push(
        tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
      );
      borrowedWeights.push(Number(reserve.config.borrowFactorPct) / 100);
      borrowedYields.push([
        { apr: -reserve.borrowApr, apy: -aprToApy(reserve.borrowApr) },
      ]);
    }

    if (suppliedAssets.length !== 0 || borrowedAssets.length !== 0) {
      const { borrowedValue, suppliedValue, value, rewardValue } =
        getElementLendingValues(
          suppliedAssets,
          borrowedAssets,
          rewardAssets,
          suppliedLtvs,
          borrowedWeights
        );

      elements.push({
        type: PortfolioElementType.borrowlend,
        networkId,
        platformId,
        label: 'Lending',
        name: 'Leverage',
        value,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields,
          suppliedAssets,
          suppliedValue,
          suppliedYields,
          collateralRatio: null,

          healthRatio: null,
          rewardAssets,
          rewardValue,
          value,
        },
      });
    }
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
