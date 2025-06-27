import { LeverageSide, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketsKey, flashPid, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../utils/solana';
import { perpetualsPositionsFilter } from './filters';
import { customOracleStruct, positionStruct } from './structs';
import { MarketInfo } from './types';
import { Side } from '../jupiter/exchange/structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const usdFactor = new BigNumber(10 ** 6);
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const perpetualsPositions = await getParsedProgramAccounts(
    client,
    positionStruct,
    flashPid,
    perpetualsPositionsFilter(owner)
  );

  if (
    perpetualsPositions.length === 0 ||
    !perpetualsPositions.some((perp) => perp.sizeUsd.isGreaterThan(0))
  )
    return [];

  const marketsInfos = await cache.getItem<MarketInfo[]>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!marketsInfos) throw new Error('No markets cached.');

  const oraclesPubkeys: PublicKey[] = [];
  const MarketById: Map<string, MarketInfo> = new Map();
  marketsInfos.forEach((market) => {
    oraclesPubkeys.push(
      new PublicKey(market.targetCustodyAccount.oracle.oracleAccount)
    );
    oraclesPubkeys.push(
      new PublicKey(market.collateralCustodyAccount.oracle.oracleAccount)
    );
    MarketById.set(market.pubkey, market);
  });

  // Fetch oracles prices
  const oracleAccounts = await getParsedMultipleAccountsInfo(
    client,
    customOracleStruct,
    oraclesPubkeys
  );
  const oraclePricesMap: Map<string, number> = new Map();
  oracleAccounts.forEach((acc, i) => {
    if (!acc) return;
    oraclePricesMap.set(
      oraclesPubkeys[i].toString(),
      acc.price.times(10 ** acc.expo).toNumber()
    );
  });

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const levElement = registry.addElementLeverage({
    label: 'Leverage',
  });
  for (const position of perpetualsPositions) {
    if (position.sizeUsd.isLessThanOrEqualTo(0)) continue;

    const market = MarketById.get(position.market.toString());
    if (!market) continue;
    if (Number(market.side) === Side.None) continue;

    const isLong = Number(market.side) === Side.Long;
    const collateralCustody = market.collateralCustodyAccount;
    const targetCustody = market.targetCustodyAccount;
    if (!market || !collateralCustody || !targetCustody) continue;

    const { collateralUsd, sizeUsd, entryPrice: oraclePrice } = position;
    const openingPrice = oraclePrice.price.multipliedBy(
      10 ** oraclePrice.exponent
    );

    const targetPrice = oraclePricesMap.get(targetCustody.oracle.oracleAccount);
    const collateralCustodyPrice = oraclePricesMap.get(
      collateralCustody.oracle.oracleAccount
    );
    if (!targetPrice || !collateralCustodyPrice) continue;
    const currentPrice = new BigNumber(targetPrice);

    const leverage = sizeUsd.dividedBy(collateralUsd);

    const collatAmount = collateralUsd
      .dividedBy(collateralCustodyPrice)
      .dividedBy(usdFactor);
    const collatValue = collateralUsd.dividedBy(usdFactor).toNumber();

    const size = collatAmount.times(leverage);
    const sizeValue = sizeUsd.dividedBy(usdFactor).toNumber();

    const priceDelta = isLong
      ? currentPrice.minus(openingPrice)
      : openingPrice.minus(currentPrice);
    const priceVar = priceDelta.dividedBy(openingPrice);

    const pnl = priceVar.times(collatValue).times(leverage).toNumber();

    levElement.addIsoPosition({
      address: targetCustody.mint.toString(),
      collateralValue: collatValue,
      entryPrice: openingPrice.toNumber(),
      markPrice: currentPrice.toNumber(),
      leverage: leverage.toNumber(),
      pnlValue: pnl,
      side: isLong ? LeverageSide.long : LeverageSide.short,
      sizeValue,
      size: size.toNumber(),
      liquidationPrice: 0,
      ref: position.pubkey.toString(),
      sourceRefs: [
        {
          address: market.pubkey,
          name: 'Market',
        },
        {
          address: targetCustody.pubkey,
          name: 'Custody',
        },
        {
          address: collateralCustody.pubkey,
          name: 'Custody',
        },
      ],
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-perpetuals`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
