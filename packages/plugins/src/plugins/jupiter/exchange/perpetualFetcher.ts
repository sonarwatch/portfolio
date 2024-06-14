import {
  LeveragePosition,
  LeverageSide,
  NetworkId,
  PortfolioElementLeverage,
  PortfolioElementType,
  UniTokenInfo,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { perpetualsPositionsFilter } from '../filters';
import { CustodyInfo } from '../types';
import { getMultipleAccountsInfoSafe } from '../../../utils/solana/getMultipleAccountsInfoSafe';
import { getPythPricesDatasMap } from '../../../utils/solana/pyth/helpers';
import { tokenListsDetailsPrefix } from '../../tokens/constants';
import { custodiesKey, perpsProgramId, platformId } from './constants';
import { Side, positionStruct } from './structs';

const usdFactor = new BigNumber(10 ** 6);
const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElementLeverage[]> => {
  const client = getClientSolana();

  const perpetualsPositions = await getParsedProgramAccounts(
    client,
    positionStruct,
    perpsProgramId,
    perpetualsPositionsFilter(owner)
  );
  if (
    perpetualsPositions.length === 0 ||
    !perpetualsPositions.some((perp) => perp.sizeUsd.isGreaterThan(0))
  )
    return [];

  const custodiesAccounts = await cache.getItem<CustodyInfo[]>(custodiesKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!custodiesAccounts) return [];

  const oraclesPubkeys: PublicKey[] = [];
  const custodyById: Map<string, CustodyInfo> = new Map();
  custodiesAccounts.forEach((acc) => {
    oraclesPubkeys.push(new PublicKey(acc.oracle.oracleAccount));
    custodyById.set(acc.pubkey, acc);
  });

  const oracleAccounts = await getMultipleAccountsInfoSafe(
    client,
    oraclesPubkeys
  );
  const pythPricesByAccount = getPythPricesDatasMap(
    oraclesPubkeys,
    oracleAccounts
  );

  const tokensDetailsById: Map<string, UniTokenInfo> = new Map();
  const tokensDetails = await cache.getItems<UniTokenInfo>(
    custodiesAccounts.map((acc) => acc.mint),
    { prefix: tokenListsDetailsPrefix, networkId: NetworkId.solana }
  );
  tokensDetails.forEach((tD) =>
    tD ? tokensDetailsById.set(tD.address, tD) : undefined
  );

  const positions: LeveragePosition[] = [];
  for (const position of perpetualsPositions) {
    const { collateralUsd, sizeUsd, price, side } = position;
    if (sizeUsd.isLessThanOrEqualTo(0)) continue;
    if (side === Side.None) continue;
    const isLong = side === Side.Long;

    const custody = custodyById.get(position.custody.toString());
    const collateralCustody = custodyById.get(
      position.collateralCustody.toString()
    );
    if (!custody || !collateralCustody) continue;

    const openingPrice = price.dividedBy(usdFactor);
    const custodyPriceData = pythPricesByAccount.get(
      custody.oracle.oracleAccount
    );
    const collateralCustodyPriceData = pythPricesByAccount.get(
      collateralCustody.oracle.oracleAccount
    );
    if (
      !custodyPriceData ||
      !custodyPriceData.price ||
      !collateralCustodyPriceData ||
      !collateralCustodyPriceData.price
    )
      continue;
    const currentPrice = new BigNumber(custodyPriceData.price);

    const leverage = sizeUsd.dividedBy(collateralUsd);
    // const collatAmount = collateralUsd
    //   .dividedBy(collateralCustodyPriceData.price)
    //   .dividedBy(usdFactor);
    const collatValue = collateralUsd.dividedBy(usdFactor).toNumber();

    // const custodyAmount = collatAmount.times(leverage);
    // const custodyValue = sizeUsd.dividedBy(usdFactor).toNumber();
    // const borrowFee = sizeUsd
    //   .times(
    //     new BigNumber(
    //       collateralCustody.fundingRateState.cumulativeInterestRate
    //     ).minus(cumulativeInterestSnapshot)
    //   )
    //   .dividedBy(10 ** 15)
    //   .absoluteValue();

    // const openAndCloseFees = sizeUsd.times(0.001).times(2).dividedBy(usdFactor);
    // const fees = borrowFee.plus(openAndCloseFees).negated().toNumber();
    const priceDelta = isLong
      ? currentPrice.minus(openingPrice)
      : openingPrice.minus(currentPrice);
    const priceVar = priceDelta.dividedBy(openingPrice);
    const pnl = priceVar.times(collatValue).times(leverage).toNumber();
    // const value = collateralUsd.dividedBy(usdFactor).plus(pnl).toNumber();

    positions.push({
      collateralValue: collateralUsd.dividedBy(usdFactor).toNumber(),
      liquidationPrice: null,
      sizeValue: sizeUsd.toNumber(),
      value: collateralUsd.dividedBy(usdFactor).plus(pnl).toNumber(),
      side: isLong ? LeverageSide.long : LeverageSide.short,
      address: custody.mint,
      leverage: leverage.toNumber(),
    });
  }

  if (positions.length === 0) return [];
  const value = getUsdValueSum(positions.map((a) => a.value));
  return [
    {
      type: PortfolioElementType.leverage,
      data: {
        positions,
        value,
        collateralAssets: [],
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
