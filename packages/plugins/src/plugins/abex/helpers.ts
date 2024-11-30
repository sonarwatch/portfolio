import {
  NetworkId,
  suiNativeAddress,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { SuiClient } from '../../utils/clients/types';
import {
  abexMarket,
  corePackage,
  ordersParent,
  positionsParent,
  symbolsParent,
} from './constants';
import {
  IFundingFeeModel,
  IMarketInfo,
  IOrderCapInfo,
  IOrderInfo,
  IPositionCapInfo,
  IPositionInfo,
  IReservingFeeModel,
  ISymbolInfo,
  IVaultInfo,
} from './types';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getObject } from '../../utils/sui/getObject';
import { getVaultInfo } from './getVaultInfo';
import { parseValue } from './parseValue';
import { Cache } from '../../Cache';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

export const getPositionCapInfoList = async (
  client: SuiClient,
  owner: string
): Promise<IPositionCapInfo[]> => {
  const positionCaps = await getOwnedObjectsPreloaded(client, owner, {
    filter: {
      MoveModule: {
        package: corePackage,
        module: 'market',
      },
    },
  });
  const positionCapInfoList = [];
  for (const positionCap of positionCaps) {
    if (positionCap.data?.type?.includes('PositionCap')) {
      positionCapInfoList.push({
        positionCapId: positionCap.data.objectId,
        symbol0: positionCap.data.type.split('<')[1].split(',')[0].trim(),
        symbol1: positionCap.data.type
          .split('<')[1]
          .split(',')[1]
          .split(',')[0]
          .trim(),
        long: positionCap.data.type.includes('LONG'),
      });
    }
  }
  return positionCapInfoList;
};

export const getPositionInfoList = async (
  client: SuiClient,
  positionCapInfoList: IPositionCapInfo[],
  marketInfo: IMarketInfo,
  cache: Cache,
  owner: string
) => {
  const positionInfoList: IPositionInfo[] = [];
  await Promise.all(
    positionCapInfoList.map(async (positionCapInfo) => {
      const positionRaw = await getDynamicFieldObject(client, {
        parentId: positionsParent,
        name: {
          type: `${corePackage}::market::PositionName<${
            positionCapInfo.symbol0
          }, ${positionCapInfo.symbol1}, ${corePackage}::market::${
            positionCapInfo.long ? 'LONG' : 'SHORT'
          }>`,
          value: {
            owner,
            id: positionCapInfo.positionCapId,
          },
        },
      });

      positionInfoList.push(
        await parsePositionInfo(
          client,
          marketInfo,
          cache,
          positionRaw,
          positionCapInfo.positionCapId
        )
      );
    })
  );

  return positionInfoList.sort((a, b) =>
    a.openTimestamp > b.openTimestamp ? 1 : -1
  );
};

const calculatePositionReserveFee = (
  position: IPositionInfo,
  vault: IVaultInfo,
  model: IReservingFeeModel,
  timestamp: number
): number => {
  const accReservingRate = calcAccReservingFeeRate(vault, model, timestamp);
  return (
    position.reservingFeeAmount +
    (accReservingRate - vault.accReservingRate) * position.collateralAmount
  );
};

const calcAccReservingFeeRate = (
  vault: IVaultInfo,
  model: IReservingFeeModel,
  timestamp: number
): number => {
  if (vault.lastUpdate > 0) {
    const elapsed = timestamp - vault.lastUpdate;
    if (elapsed > 0) {
      const utilization = vaultUtilization(vault);
      return (
        vault.accReservingRate +
        calcReservingFeeRate(model, utilization, elapsed)
      );
    }
  }
  return vault.accReservingRate;
};

const vaultUtilization = (vault: IVaultInfo): number => {
  const supplyAmount =
    vault.liquidity + vault.reservedAmount + vault.unrealisedReservingFeeAmount;
  if (supplyAmount === 0) {
    return 0;
  }
  return vault.reservedAmount / supplyAmount;
};

const SECONDS_PER_EIGHT_HOUR = 8 * 60 * 60;

const calcReservingFeeRate = (
  model: IReservingFeeModel,
  utilization: number,
  elapsed: number
): number =>
  (model.multiplier * utilization * elapsed) / SECONDS_PER_EIGHT_HOUR;

const calculatePositionFundingFee = (
  position: IPositionInfo,
  symbol: ISymbolInfo,
  model: IFundingFeeModel,
  price: number,
  lpSupplyAmount: number,
  timestamp: number
): number => {
  const accFundingRate = calcAccFundingFeeRate(
    symbol,
    model,
    price,
    lpSupplyAmount,
    timestamp
  );
  return (
    position.fundingFeeValue +
    (accFundingRate - symbol.accFundingRate) * position.positionSize
  );
};

const calcDeltaSize = (symbol: ISymbolInfo, price: number): number => {
  const latestSize =
    (symbol.openingAmount / symbol.priceConfig.precision) * price;
  return symbol.long
    ? symbol.openingSize - latestSize
    : latestSize - symbol.openingSize;
};

const calcFundingFeeRate = (
  model: IFundingFeeModel,
  pnlPerRate: number,
  elapsed: number
): number => {
  const dailyRate = Math.min(
    model.multiplier * Math.abs(pnlPerRate),
    model.max
  );
  const secondsRate = (dailyRate * elapsed) / SECONDS_PER_EIGHT_HOUR;
  return pnlPerRate >= 0 ? -secondsRate : secondsRate;
};

const calcAccFundingFeeRate = (
  symbol: ISymbolInfo,
  model: IFundingFeeModel,
  price: number,
  lpSupplyAmount: number,
  timestamp: number
): number => {
  if (symbol.lastUpdate > 0) {
    const elapsed = timestamp - symbol.lastUpdate;
    if (elapsed > 0) {
      const deltaSize = calcDeltaSize(symbol, price);
      const pnlPerLp =
        (symbol.realisedPnl + symbol.unrealisedFundingFeeValue + deltaSize) /
        lpSupplyAmount;
      return (
        symbol.accFundingRate + calcFundingFeeRate(model, pnlPerLp, elapsed)
      );
    }
  }
  return symbol.accFundingRate;
};

const parsePositionInfo = async (
  client: SuiClient,
  marketInfo: IMarketInfo,
  cache: Cache,
  raw: any,
  id_: string
): Promise<IPositionInfo> => {
  const { content } = raw.data;
  const { fields } = content;
  const positionFields = fields.value.fields;
  const dataType = fields.name.type;

  const positionInfo = {
    id: id_,
    long: dataType.includes('::market::LONG'),
    owner: fields.name.fields.owner,
    version: parseInt(raw.data.version, 10),
    collateralToken: dataType.split('<')[1].split(',')[0].trim(),
    indexToken: dataType.split(',')[1].trim(),
    collateralAmount: parseValue(positionFields.collateral),
    positionAmount: parseValue(positionFields.position_amount),
    reservedAmount: parseValue(positionFields.reserved),
    positionSize: parseValue(positionFields.position_size),
    lastFundingRate: parseValue(positionFields.last_funding_rate),
    lastReservingRate: parseValue(positionFields.last_reserving_rate),
    reservingFeeAmount: parseValue(positionFields.reserving_fee_amount),
    fundingFeeValue: parseValue(positionFields.funding_fee_value),
    closed: positionFields.closed,
    openTimestamp: parseValue(positionFields.open_timestamp),
    openFeeBps: parseValue(positionFields.config.fields.open_fee_bps),
  };

  const vaultInfo = await getVaultInfo(client, positionInfo.collateralToken);

  positionInfo.reservingFeeAmount = calculatePositionReserveFee(
    positionInfo,
    vaultInfo,
    vaultInfo.reservingFeeModel,
    Date.now() / 1000
  );

  const indexTokenPrice = await cache.getTokenPrice(
    positionInfo.indexToken,
    NetworkId.sui
  );

  if (indexTokenPrice) {
    positionInfo.fundingFeeValue = calculatePositionFundingFee(
      positionInfo,
      await getSymbolInfo(client, positionInfo.indexToken, positionInfo.long),
      (await getSymbolInfo(client, positionInfo.indexToken, positionInfo.long))
        .fundingFeeModel,
      indexTokenPrice.price,
      marketInfo.lpSupplyWithDecimals,
      Date.now() / 1000
    );
  }

  return positionInfo;
};

export const getMarketInfo = async (client: SuiClient) => {
  const rawData = await getObject(client, abexMarket, {
    showContent: true,
  });
  return parseMarketInfo(rawData);
};

const ALP_TOKEN_DECIMALS = 6;

const parseMarketInfo = (raw: any): IMarketInfo => {
  const content = raw.data.content.fields;

  return {
    lpSupply: content.lp_supply.fields.value,
    positionId: content.positions.fields.id.id,
    vaultId: content.vaults.fields.id.id,
    symbolId: content.symbols.fields.id.id,
    referralId: content.referrals.fields.id.id,
    orderId: content.orders.fields.id.id,
    rebaseFeeModel: content.rebase_fee_model,
    lpSupplyWithDecimals:
      content.lp_supply.fields.value / 10 ** ALP_TOKEN_DECIMALS,
  };
};

const getSymbolInfo = async (
  client: SuiClient,
  indexToken: string,
  long: boolean
) => {
  const rawData = await getDynamicFieldObject(client, {
    parentId: symbolsParent,
    name: {
      type: `${corePackage}::market::SymbolName<${indexToken}, ${corePackage}::market::${
        long ? 'LONG' : 'SHORT'
      }>`,
      value: { dummy_field: false },
    },
  });
  return parseSymbolInfo(client, rawData, long);
};

const parseSymbolInfo = async (
  client: SuiClient,
  raw: any,
  long: boolean
): Promise<ISymbolInfo> => {
  const { fields } = raw.data.content.fields.value;
  const fundingFeeModelAddr = fields.funding_fee_model;
  const fundingFeeModelRaw = await getObject(client, fundingFeeModelAddr, {
    showContent: true,
  });
  const fundingFeeModel = parseFundingFeeModel(fundingFeeModelRaw);

  return {
    openingSize: parseValue(fields.opening_size),
    openingAmount: parseValue(fields.opening_amount),
    accFundingRate: parseValue(fields.acc_funding_rate),
    realisedPnl: parseValue(fields.realised_pnl),
    unrealisedFundingFeeValue: parseValue(fields.unrealised_funding_fee_value),
    openEnabled: fields.open_enabled,
    liquidateEnabled: fields.liquidate_enabled,
    decreaseEnabled: fields.decrease_enabled,
    lastUpdate: parseValue(fields.last_update),
    fundingFeeModel,
    long,
    priceConfig: {
      maxInterval: parseValue(fields.price_config.fields.max_interval),
      maxConfidence: parseValue(fields.price_config.fields.max_confidence),
      precision: parseValue(fields.price_config.fields.precision),
      feeder: fields.price_config.fields.feeder,
    },
  };
};

const parseFundingFeeModel = (raw: any): IFundingFeeModel => {
  const { fields } = raw.data.content;

  return {
    multiplier: parseValue(fields.multiplier),
    max: parseValue(fields.max),
  };
};

export const getOrderCapInfoList = async (client: SuiClient, owner: string) => {
  const orderCaps = await getOwnedObjectsPreloaded(client, owner, {
    filter: {
      MoveModule: {
        package: corePackage,
        module: 'market',
      },
    },
  });
  const orderCapInfoList = [];
  for (const orderCap of orderCaps) {
    if (orderCap.data?.type?.includes('OrderCap')) {
      orderCapInfoList.push({
        orderCapId: orderCap.data.objectId,
        symbol0: orderCap.data.type.split('<')[1].split(',')[0].trim(),
        symbol1: orderCap.data.type
          .split('<')[1]
          .split(',')[1]
          .split(',')[0]
          .trim(),
        long: orderCap.data.type.includes('LONG'),
        positionId: (orderCap.data.content as any)?.fields?.position_id,
      });
    }
  }
  return orderCapInfoList;
};

export const getOrderInfoList = async (
  client: SuiClient,
  orderCapInfoList: IOrderCapInfo[],
  owner: string
) => {
  const orderInfoList: IOrderInfo[] = [];
  await Promise.all(
    orderCapInfoList.map(async (orderCapInfo) => {
      const orderRaw = await getDynamicFieldObject(client, {
        parentId: ordersParent,
        name: {
          type: `${corePackage}::market::OrderName<${orderCapInfo.symbol0}, ${
            orderCapInfo.symbol1
          }, ${corePackage}::market::${
            orderCapInfo.long ? 'LONG' : 'SHORT'
          }, ${suiNativeAddress}>`,
          value: {
            owner,
            id: orderCapInfo.orderCapId,
            position_id: {
              vec: orderCapInfo.positionId ? [orderCapInfo.positionId] : [],
            },
          },
        },
      });
      orderInfoList.push(parseOrderInfo(orderRaw, orderCapInfo.orderCapId));
    })
  );
  return orderInfoList.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
};

const parseOrderInfo = (raw: any, capId: string): IOrderInfo => {
  const { content } = raw.data;
  const { fields } = content.fields.value;

  // Extract tokens from dataType
  const dataType = content.type;

  const orderType = content.fields.value.type.includes('OpenPositionOrder')
    ? 'OPEN_POSITION'
    : 'DECREASE_POSITION';

  const ret: IOrderInfo = {
    id: content.fields.id.id,
    capId,
    executed: fields.executed,
    owner: content.fields.name.fields.owner,
    collateralToken: dataType.split('<')[2].split(',')[0].trim(),
    indexToken: dataType.split(',')[1].trim(),
    feeToken: dataType.split(',')[3].split('>')[0].trim(),
    indexPrice: parseValue(
      fields.limited_index_price.fields.price || fields.limited_index_price
    ),
    collateralPriceThreshold: parseValue(fields.collateral_price_threshold),
    feeAmount: BigNumber(fields.fee),
    long: dataType.includes('::market::LONG'),
    orderType,
    createdAt: parseValue(fields.created_at),
    v11Order: !fields.limited_index_price.fields.price,
  };

  if (orderType === 'OPEN_POSITION') {
    ret.openOrder = {
      reserveAmount: BigNumber(fields.reserve_amount),
      collateralAmount: BigNumber(fields.collateral),
      openAmount: BigNumber(fields.open_amount),
    };
  } else {
    ret.decreaseOrder = {
      decreaseAmount: BigNumber(fields.decrease_amount),
      takeProfit: fields.take_profit,
    };
  }

  return ret;
};

export const calculatePNL = async (
  position: IPositionInfo,
  tokenPriceIndex: TokenPrice,
  tokenPriceCollateral: TokenPrice
) => {
  // Size = indexTokenPrice * indexTokenAmount
  // OpenFee = EntrySize * openFeeBps
  // ReservingFee = accReservingRate ???
  // FundingFee = accFundingRate ???
  // $PNL = Size - EntrySize - OpenFee - ReservingFee - FundingFee
  // PNL% ???

  const indexPrice = tokenPriceIndex.price;
  const collateralPrice = tokenPriceCollateral.price;

  const size =
    (indexPrice * position.positionAmount) / 10 ** tokenPriceIndex.decimals;
  const openFee = position.positionSize * position.openFeeBps;
  const reservingFee =
    (position.reservingFeeAmount * collateralPrice) /
    10 ** tokenPriceCollateral.decimals;
  const fundingFee = position.fundingFeeValue;
  const delta = (size - position.positionSize) * (position.long ? 1 : -1);
  const pnlValue = delta - openFee - reservingFee - fundingFee;
  const pnlInCollateral = pnlValue / collateralPrice;
  const pnlInCollateralPercentage =
    (pnlInCollateral / position.collateralAmount) *
    10 ** tokenPriceCollateral.decimals;

  const leverage =
    ((position.positionAmount * indexPrice) / 10 ** tokenPriceIndex.decimals -
      pnlValue +
      openFee) /
    ((position.collateralAmount * collateralPrice) /
      10 ** tokenPriceCollateral.decimals);

  return {
    delta,
    reservingFee,
    fundingFee,
    pnlValue,
    pnlInCollateral,
    pnlInCollateralPercentage,
    openFee,
    leverage,
  };
};
