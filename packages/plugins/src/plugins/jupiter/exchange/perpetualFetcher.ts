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
import { perpetualsPositionsFilter } from '../filters';
import { CustodyInfo, PerpetualPoolInfo } from '../types';
import {
  custodiesKey,
  perpPoolsKey,
  perpsProgramId,
  platformId,
} from './constants';
import { Side, positionStruct } from './structs';
import { getFeeAmount } from './helpers';

const usdFactor = new BigNumber(10 ** 6);
const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElementLeverage[]> => {
  const client = getClientSolana();

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

  const [custodiesAccounts, perpPoolsArr] = await Promise.all([
    cache.getItem<CustodyInfo[]>(custodiesKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    cache.getItem<ParsedAccount<PerpetualPoolInfo>[]>(perpPoolsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);
  if (!custodiesAccounts || !perpPoolsArr) return [];

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

    const openAndCloseFees = openFee.add(closeFee).div(new BN(1000000));
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

    levPositions.push({
      address: custody.mint,
      side: isLong ? LeverageSide.long : LeverageSide.short,
      leverage: leverage.toNumber(),
      liquidationPrice: null,
      collateralValue: collateralValue.toNumber(),
      size: size.toNumber(),
      sizeValue: sizeValue.toNumber(),
      pnlValue: rawPnlValue.toNumber(),
      value: value.toNumber(),
      markPrice: currentPrice,
      entryPrice: entryPrice.toNumber(),
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
