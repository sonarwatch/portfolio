import {
  LevPosition,
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
import { ParsedAccount, getParsedProgramAccounts } from '../../../utils/solana';
import { perpetualsPositionsFilter } from '../filters';
import { CustodyInfo, PerpetualPoolInfo } from '../types';
import { getPythPricesAsMap } from '../../../utils/solana/pyth/helpers';
import { tokenListsDetailsPrefix } from '../../tokens/constants';
import {
  custodiesKey,
  perpPoolsKey,
  perpsProgramId,
  platformId,
} from './constants';
import { Side, positionStruct } from './structs';

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

  const custodiesAccounts = await cache.getItem<CustodyInfo[]>(custodiesKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!custodiesAccounts) return [];

  const perpPoolsArr = await cache.getItem<ParsedAccount<PerpetualPoolInfo>[]>(
    perpPoolsKey,
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  if (!perpPoolsArr) return [];

  const perpPools: Map<string, PerpetualPoolInfo> = new Map();
  perpPoolsArr.forEach((a) => {
    perpPools.set(a.pubkey.toString(), a);
  });

  const oraclesPubkeys: PublicKey[] = [];
  const custodyById: Map<string, CustodyInfo> = new Map();
  custodiesAccounts.forEach((a) => {
    oraclesPubkeys.push(new PublicKey(a.oracle.oracleAccount));
    custodyById.set(a.pubkey, a);
  });

  const pythPricesByAccount = await getPythPricesAsMap(client, oraclesPubkeys);

  const tokensDetailsById: Map<string, UniTokenInfo> = new Map();
  const tokensDetails = await cache.getItems<UniTokenInfo>(
    custodiesAccounts.map((acc) => acc.mint),
    { prefix: tokenListsDetailsPrefix, networkId: NetworkId.solana }
  );
  tokensDetails.forEach((tD) =>
    tD ? tokensDetailsById.set(tD.address, tD) : undefined
  );

  const levPositions: LevPosition[] = [];
  for (const position of positionAccounts) {
    const {
      collateralUsd,
      sizeUsd,
      price,
      side,
      cumulativeInterestSnapshot,
      lockedAmount,
    } = position;
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
    const currentPrice = pythPricesByAccount.get(custody.oracle.oracleAccount);
    if (!currentPrice) continue;

    const size = lockedAmount.div(10 ** custody.decimals);
    const sizeValue = sizeUsd.dividedBy(usdFactor);
    const leverage = sizeUsd.dividedBy(collateralUsd);
    const collateralValue = collateralUsd.dividedBy(usdFactor);
    const { increasePositionBps, decreasePositionBps } = perpPool.fees;
    const increaseFees = new BigNumber(increasePositionBps).div(10000);
    const decreaseFees = new BigNumber(decreasePositionBps).div(10000);
    const openFees = entryPrice.times(size).times(increaseFees);
    const closeFees = sizeValue.times(decreaseFees);

    const openAndCloseFees = openFees.plus(closeFees);
    const borrowFee = sizeUsd
      .times(
        new BigNumber(
          collateralCustody.fundingRateState.cumulativeInterestRate
        ).minus(cumulativeInterestSnapshot)
      )
      .dividedBy(10 ** 15)
      .absoluteValue();
    const fees = borrowFee.plus(openAndCloseFees).toNumber();

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
    });
  }

  if (levPositions.length === 0) return [];
  const value = getUsdValueSum(levPositions.map((a) => a.value));
  return [
    {
      type: PortfolioElementType.leverage,
      data: {
        positions: levPositions,
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
