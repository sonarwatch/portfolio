import {
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { phoenixPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { seatStruct } from './structs/seat';
import { marketHeaderStruct } from './structs/marketHeader';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';
import { getTraderState } from './helpers/deserializeMarketData';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    connection,
    seatStruct,
    phoenixPid,
    [
      {
        dataSize: seatStruct.byteSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 40,
        },
      },
    ]
  );
  if (accounts.length === 0) return [];

  const marketAddresses = accounts.map((acc) => acc.market);
  const marketsAccounts = await getMultipleAccountsInfoSafe(
    connection,
    marketAddresses
  );

  const marketHeaders = marketsAccounts.map((acc) =>
    acc ? marketHeaderStruct.deserialize(acc.data)[0] : null
  );
  const mints: string[] = [];
  const decimals: Map<string, number> = new Map();
  marketHeaders.forEach((mh) => {
    if (!mh) return;
    const quoteMint = mh.quoteParams.mintKey.toString();
    const baseMint = mh.baseParams.mintKey.toString();
    mints.push(quoteMint, baseMint);
    decimals.set(quoteMint, mh.quoteParams.decimals);
    decimals.set(baseMint, mh.baseParams.decimals);
  });
  if (mints.length === 0) return [];
  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.solana);

  const liquidities: PortfolioLiquidity[] = [];
  for (let i = 0; i < accounts.length; i++) {
    const seatAcc = accounts.at(i);
    const marketAcc = marketsAccounts.at(i);
    const marketHeader = marketHeaders.at(i);
    if (!marketAcc || !marketHeader || !seatAcc) continue;
    const traderState = getTraderState(marketAcc.data, owner);
    if (!traderState) continue;
    const baseMint = marketHeader.baseParams.mintKey.toString();
    const baseDecimals = decimals.get(baseMint);
    const quoteMint = marketHeader.quoteParams.mintKey.toString();
    const quoteDecimals = decimals.get(quoteMint);
    if (baseDecimals === undefined || quoteDecimals === undefined) continue;

    const baseAmount = new BigNumber(traderState.baseLotsFree.toString())
      .plus(traderState.baseLotsLocked.toString())
      .div(10 ** baseDecimals)
      .times(marketHeader.baseLotSize)
      .toNumber();
    const quoteAmount = new BigNumber(traderState.quoteLotsFree.toString())
      .plus(traderState.quoteLotsLocked.toString())
      .div(10 ** quoteDecimals)
      .times(marketHeader.quoteLotSize)
      .toNumber();
    if (baseAmount === 0 && quoteAmount === 0) continue;

    const baseAsset = tokenPriceToAssetToken(
      baseMint,
      baseAmount,
      NetworkId.solana,
      tokenPrices.get(baseMint)
    );
    const quoteAsset = tokenPriceToAssetToken(
      quoteMint,
      quoteAmount,
      NetworkId.solana,
      tokenPrices.get(quoteMint)
    );
    const value = getUsdValueSum([baseAsset.value, quoteAsset.value]);

    const liquidity: PortfolioLiquidity = {
      assets: [baseAsset, quoteAsset],
      assetsValue: value,
      rewardAssets: [],
      rewardAssetsValue: 0,
      value,
      yields: [],
      link: `https://app.phoenix.trade/market/${seatAcc.market.toString()}`,
      ref: seatAcc.toString(),
      sourceRefs: [
        {
          name: 'Market',
          address: seatAcc.market.toString(),
        },
      ],
    };
    liquidities.push(liquidity);
  }

  if (liquidities.length === 0) return [];
  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.solana,
      platformId,
      label: 'Deposit',
      value: getUsdValueSum(liquidities.map((l) => l.value)),
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
