import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
  TokenPrice,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { platformId, reservesKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getClientSolana } from '../../utils/clients';
import { obligationStruct } from './structs/klend';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { ReserveData } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const networkId = NetworkId.solana;

  const reserves = await cache.getItem<Record<string, ReserveData>>(
    reservesKey,
    {
      prefix: platformId,
      networkId,
    }
  );
  if (!reserves) return [];

  const obligationAccounts = await getParsedAccountInfo(
    client,
    obligationStruct,
    new PublicKey('4VnE9WB3JC5eE3jqmruz3ftwQu4TiHRAH2Gi4DS5qkYh')
  );
  if (!obligationAccounts) return [];

  const tokenAddresses = Object.entries(reserves).map(
    (entry) => reserves[entry[0]].liquidity.mintPubkey
  );

  const tokensPrices = await cache.getTokenPrices(tokenAddresses, networkId);
  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokensPrices.forEach((tP) => (tP ? tokenPriceById.set(tP.address, tP) : []));

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  const suppliedLtvs: number[] = [];
  const borrowedWeights: number[] = [];
  for (const deposit of obligationAccounts.deposits) {
    if (
      deposit.depositReserve.toString() ===
        '11111111111111111111111111111111' ||
      deposit.depositedAmount.isLessThanOrEqualTo(0)
    )
      continue;

    const amountRaw = deposit.depositedAmount;
    const reserve = reserves[deposit.depositReserve.toString()];
    const mint = reserve.liquidity.mintPubkey;
    const tokenPrice = tokenPriceById.get(mint);
    const amount = amountRaw
      .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
      .toNumber();
    suppliedAssets.push(
      tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
    );
    suppliedLtvs.push(reserve.config.loanToValuePct / 100);
  }

  for (const borrow of obligationAccounts.borrows) {
    if (
      borrow.borrowReserve.toString() === '11111111111111111111111111111111' ||
      borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
    )
      continue;

    const amountRaw = borrow.borrowedAmountSf.dividedBy(
      borrow.cumulativeBorrowRateBsf.value0
    );
    const reserve = reserves[borrow.borrowReserve.toString()];
    const mint = reserve.liquidity.mintPubkey;
    const tokenPrice = tokenPriceById.get(mint);
    const amount = amountRaw
      .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
      .toNumber();
    borrowedAssets.push(
      tokenPriceToAssetToken(mint, amount, networkId, tokenPrice)
    );
    borrowedWeights.push(Number(reserve.config.borrowFactorPct) / 100);
  }

  if (suppliedAssets.length === 0 && borrowedAssets.length === 0) return [];

  const { borrowedValue, collateralRatio, suppliedValue, value, healthRatio } =
    getElementLendingValues(
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
      suppliedLtvs,
      borrowedWeights
    );

  return [
    {
      type: PortfolioElementType.borrowlend,
      networkId,
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
        collateralRatio,
        healthRatio,
        rewardAssets,
        value,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
