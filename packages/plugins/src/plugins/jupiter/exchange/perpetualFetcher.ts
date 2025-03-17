import {
  IsoLevPosition,
  LeverageSide,
  NetworkId,
  PortfolioElementLeverage,
  PortfolioElementType,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { ParsedAccount, getParsedProgramAccounts } from '../../../utils/solana';
import { perpetualsPositionsFilter, positionRequestFilters } from '../filters';
import { CustodyInfo, PerpetualPoolInfo } from '../types';
import {
  custodiesKey,
  perpPoolsKey,
  perpsProgramId,
  platformId,
} from './constants';
import { Side, positionRequestStruct, positionStruct } from './structs';
import {
  custodyToBN,
  getFeeAmount,
  getLiquidationPrice,
  positionToBn,
  USD_POWER,
  USD_POWER_BIGN,
} from './helpersPerps';

const usdFactor = new BigNumber(10 ** 6);
const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElementLeverage[]> => {
  const client = getClientSolana({ commitment: 'processed' });

  const positionAccounts = await getParsedProgramAccounts(
    client,
    positionStruct,
    perpsProgramId,
    perpetualsPositionsFilter(owner)
  );
  if (
    positionAccounts.length === 0 ||
    positionAccounts.every((perp) => perp.sizeUsd.isLessThanOrEqualTo(0))
  )
    return [];

  const [custodiesAccounts, perpPoolsArr, prAccounts] = await Promise.all([
    cache.getItem<CustodyInfo[]>(custodiesKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    cache.getItem<ParsedAccount<PerpetualPoolInfo>[]>(perpPoolsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    getParsedProgramAccounts(
      client,
      positionRequestStruct,
      perpsProgramId,
      positionRequestFilters(owner)
    ),
  ]);
  if (!custodiesAccounts) throw new Error('No custodies cached');
  if (!perpPoolsArr) throw new Error('No perp pools cached');

  const prAccountsObj: Record<
    string,
    { tp: number | null; sl: number | null }
  > = {};

  prAccounts.forEach((a) => {
    const position = a.position.toString();
    if (a.executed || !a.triggerPrice) return;
    if (!prAccountsObj[position])
      prAccountsObj[position] = {
        tp: null,
        sl: null,
      };

    if (a.triggerAboveThreshold)
      prAccountsObj[position].tp = a.triggerPrice
        .dividedBy(USD_POWER_BIGN)
        .toNumber();
    else
      prAccountsObj[position].sl = a.triggerPrice
        .dividedBy(USD_POWER_BIGN)
        .toNumber();
  });

  const perpPools: Map<string, PerpetualPoolInfo> = new Map();
  perpPoolsArr.forEach((a) => {
    perpPools.set(a.pubkey.toString(), a);
  });

  const oraclesPubkeys: PublicKey[] = [];
  const mints: Set<string> = new Set();
  const custodyById: Map<string, CustodyInfo> = new Map();
  custodiesAccounts.forEach((a) => {
    oraclesPubkeys.push(new PublicKey(a.oracle.oracleAccount));
    custodyById.set(a.pubkey, a);
    mints.add(a.mint.toString());
  });

  const currentPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  // const pythPricesByAccount = await getPythPricesAsMap(client, oraclesPubkeys);

  const levPositions: IsoLevPosition[] = [];
  for (const position of positionAccounts) {
    const { collateralUsd, sizeUsd, price, side, cumulativeInterestSnapshot } =
      position;
    if (sizeUsd.isLessThanOrEqualTo(0)) continue;
    if (side === Side.None) continue;

    const isLong = side === Side.Long;
    const custody = custodyById.get(position.custody.toString());
    const collateralCustody = custodyById.get(
      position.collateralCustody.toString()
    );
    if (!custody || !collateralCustody) continue;
    const perpPool = perpPools.get(custody.pool);
    if (!perpPool) continue;

    const entryPrice = price.dividedBy(usdFactor);
    // const currentPrice = pythPricesByAccount.get(custody.oracle.oracleAccount);
    const currentTokenPrice = currentPriceById.get(custody.mint.toString());
    if (!currentTokenPrice) continue;

    const currentPrice = currentTokenPrice.price;

    const sizeValue = sizeUsd.dividedBy(usdFactor);
    const size = sizeValue.div(entryPrice);
    const leverage = sizeUsd.dividedBy(collateralUsd);
    const collateralValue = collateralUsd.dividedBy(usdFactor);

    const openFee = getFeeAmount(
      new BN(custody.increasePositionBps),
      new BN(sizeUsd.toString()),
      new BN(custody.pricing.tradeSpreadLong)
    );

    const closeFee = getFeeAmount(
      new BN(custody.increasePositionBps),
      new BN(sizeUsd.toString()),
      new BN(custody.pricing.tradeSpreadLong)
    );

    const curtime = new BN(Number(new Date()) / 1000);
    const liquidationPriceBn = getLiquidationPrice(
      positionToBn(position),
      custodyToBN(custody),
      custodyToBN(collateralCustody),
      curtime
    );
    const liquidationPrice = new BigNumber(liquidationPriceBn.toString())
      .div(usdFactor)
      .toNumber();

    const openAndCloseFees = openFee.add(closeFee).div(USD_POWER);
    const borrowFee = sizeUsd
      .times(
        new BigNumber(
          collateralCustody.fundingRateState.cumulativeInterestRate
        ).minus(cumulativeInterestSnapshot)
      )
      .dividedBy(10 ** 15)
      .absoluteValue();
    const fees = borrowFee.plus(openAndCloseFees.toNumber()).toNumber();

    const priceDelta = isLong
      ? new BigNumber(currentPrice).minus(entryPrice)
      : entryPrice.minus(currentPrice);
    const priceVar = priceDelta.dividedBy(entryPrice);
    const rawPnlValue = priceVar.times(collateralValue).times(leverage);
    const netPnlValue = rawPnlValue.minus(fees);
    const value = collateralValue.plus(netPnlValue);

    const positionPubkey = position.pubkey.toString();
    const tp = prAccountsObj[positionPubkey]?.tp || undefined;
    const sl = prAccountsObj[positionPubkey]?.sl || undefined;

    levPositions.push({
      address: custody.mint,
      side: isLong ? LeverageSide.long : LeverageSide.short,
      leverage: leverage.toNumber(),
      liquidationPrice,
      collateralValue: collateralValue.toNumber(),
      size: size.toNumber(),
      sizeValue: sizeValue.toNumber(),
      pnlValue: rawPnlValue.toNumber(),
      value: value.toNumber(),
      markPrice: currentPrice,
      entryPrice: entryPrice.toNumber(),
      tp,
      sl,
    });
  }

  if (levPositions.length === 0) return [];
  const value = getUsdValueSum(levPositions.map((a) => a.value));
  return [
    {
      type: PortfolioElementType.leverage,
      data: {
        isolated: {
          positions: levPositions,
          value,
        },
        value,
        contract: perpsProgramId.toString(),
      },
      label: 'Leverage',
      networkId: NetworkId.solana,
      platformId,
      value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-perpetual`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
