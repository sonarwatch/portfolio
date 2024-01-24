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
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  mainMarket,
  marketsPrefix,
  pid,
  platformId,
  reservesPrefix,
  wadsDecimal,
} from './constants';
import { getObligationSeed, parseDataflat } from './helpers';
import { MarketInfo, ReserveInfo, ReserveInfoExtended } from './types';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { obligationStruct } from './structs';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';
import { AUTOMATION_PUBLIC_KEY } from '../flexlend/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const obligationAddresses = [];
  const markets = await cache.getAllItems<MarketInfo>({
    prefix: marketsPrefix,
    networkId: NetworkId.solana,
  });
  if (markets.length === 0) return [];
  const marketsByAddress: Map<string, MarketInfo> = new Map();
  markets.forEach((market) => {
    marketsByAddress.set(market.address.toString(), market);
  });

  for (const marketInfo of markets) {
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
      obligationAddresses.push(obligationAddress);
    }
  }
  // Flexlend, only support the main pool on Solend
  const marketSeed = mainMarket.slice(0, 16);
  const ownerSeed = owner.slice(0, 16);
  const obligationSeed = ownerSeed + marketSeed;
  const flexlendObligAddress = await PublicKey.createWithSeed(
    AUTOMATION_PUBLIC_KEY,
    obligationSeed,
    pid
  );
  obligationAddresses.push(flexlendObligAddress);

  const obligations = await getParsedMultipleAccountsInfo(
    client,
    obligationStruct,
    obligationAddresses
  );
  if (obligations.length === 0) return [];

  const reserveAddresses: Set<string> = new Set();
  obligations.forEach((obligation) => {
    if (!obligation) return;

    const market = marketsByAddress.get(obligation.lendingMarket.toString());
    if (!market) return;

    market.reserves.forEach((reserve) => {
      reserveAddresses.add(reserve.address);
    });
  });
  const reservesInfos = await cache.getItems<ReserveInfoExtended>(
    Array.from(reserveAddresses),
    {
      prefix: reservesPrefix,
      networkId: NetworkId.solana,
    }
  );
  if (!reservesInfos) return [];

  const reserveByAddress: Map<string, ReserveInfo> = new Map();
  reservesInfos.forEach((reserve) => {
    if (!reserve) return;

    reserveByAddress.set(reserve.pubkey, reserve);
  });

  const tokensAddresses: Set<string> = new Set();
  reservesInfos.forEach((reserveInfo) => {
    if (!reserveInfo) return;

    tokensAddresses.add(reserveInfo.reserve.liquidity.mintPubkey);
  });

  const tokenPriceResults = await runInBatch(
    [...tokensAddresses].map(
      (mint) => () => cache.getTokenPrice(mint, NetworkId.solana)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  const elements: PortfolioElement[] = [];
  for (let i = 0; i < obligations.length; i += 1) {
    const obligation = obligations[i];
    if (!obligation) continue;

    const market = marketsByAddress.get(obligation.lendingMarket.toString());
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
      const lTokenPrice = tokenPrices.get(lMint);

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
              lTokenPrice
            )
          );
        }
      }
    }
    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, suppliedValue, value, healthRatio } =
      getElementLendingValues(
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
        suppliedLtvs,
        borrowedWeights
      );

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
        collateralRatio: null,

        healthRatio,
        rewardAssets,
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
