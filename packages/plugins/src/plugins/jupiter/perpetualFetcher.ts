import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { custodiesKey, perpsProgramId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { Side, positionStruct } from './structs';
import { perpetualsPositionsFilter } from './filters';
import { CustodyInfo } from './types';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';

const usdFactor = new BigNumber(10 ** 6);
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const perpetualsPositions = await getParsedProgramAccounts(
    client,
    positionStruct,
    perpsProgramId,
    perpetualsPositionsFilter(owner)
  );
  if (perpetualsPositions.length === 0) return [];

  const custodiesAccounts = await cache.getItem<CustodyInfo[]>(custodiesKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!custodiesAccounts) return [];

  const custodyById: Map<string, CustodyInfo> = new Map();
  custodiesAccounts.forEach((acc) => custodyById.set(acc.pubkey, acc));

  const tokenPriceById = await getTokenPricesMap(
    custodiesAccounts.map((acc) => acc.mint.toString()),
    NetworkId.solana,
    cache
  );
  const elements: PortfolioElement[] = [];

  for (const position of perpetualsPositions) {
    const custody = custodyById.get(position.collateralCustody.toString());
    if (!custody) continue;

    const tokenPrice = tokenPriceById.get(custody.mint.toString());
    if (!tokenPrice) continue;

    if (position.side === Side.None) continue;
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    const { collateralUsd, sizeUsd, price } = position;

    const openingPrice = position.price.dividedBy(usdFactor);
    const currentPrice = new BigNumber(tokenPrice.price);

    const leverage = sizeUsd.dividedBy(collateralUsd);

    const amountDeposited = collateralUsd.dividedBy(price);
    const suppliedValue = collateralUsd.dividedBy(usdFactor).toNumber();
    suppliedAssets.push({
      type: 'generic',
      networkId: NetworkId.solana,
      value: collateralUsd.dividedBy(usdFactor).toNumber(),
      data: { name: '', amount: amountDeposited.toNumber() },
    });

    const amountBorrowed = amountDeposited.times(leverage);
    const borrowedValue = sizeUsd.dividedBy(usdFactor).toNumber();
    borrowedAssets.push({
      type: 'generic',
      networkId: NetworkId.solana,
      value: borrowedValue,
      data: { name: '', amount: amountBorrowed.toNumber() },
    });

    const priceDifference =
      position.side === Side.Long
        ? currentPrice.minus(openingPrice)
        : openingPrice.minus(currentPrice);

    const pnl = priceDifference.times(amountDeposited).times(leverage);
    rewardAssets.push({
      type: 'generic',
      networkId: NetworkId.solana,
      value: pnl.toNumber(),
      data: { name: 'PNL ($)', amount: pnl.toNumber() },
    });

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const value = collateralUsd.dividedBy(usdFactor).plus(pnl).toNumber();

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Leverage',
      value,
      name: `${position.side} ${leverage.decimalPlaces(1)}x`,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        collateralRatio: null,
        rewardAssets,
        value,
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-perpetual`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
