import {
  NetworkId,
  PortfolioElement,
  PortfolioLiquidity,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import {
  platformId,
  openBookV3ProgramId,
  serumV3ProgramId,
} from '../constants';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../../utils/solana';
import { openOrdersV2Struct } from '../../raydium/structs/openOrders';
import { serumOrdersV2Filter } from './filters';
import { SerumMarketV2, serumMarketV2Struct } from './structs';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const openBookOrdersAccounts = await getParsedProgramAccounts(
    client,
    openOrdersV2Struct,
    openBookV3ProgramId,
    serumOrdersV2Filter(owner)
  );
  const serumOpenOrdersAccounts = await getParsedProgramAccounts(
    client,
    openOrdersV2Struct,
    serumV3ProgramId,
    serumOrdersV2Filter(owner)
  );
  const openOrders = [...serumOpenOrdersAccounts, ...openBookOrdersAccounts];
  const marketsAddresses: Set<PublicKey> = new Set();
  for (let i = 0; i < openOrders.length; i++) {
    const order = openOrders[i];
    marketsAddresses.add(order.market);
  }

  const marketsAccounts = await getParsedMultipleAccountsInfo(
    client,
    serumMarketV2Struct,
    Array.from(marketsAddresses)
  );
  if (!marketsAccounts) return [];

  const marketsByAddress: Map<string, SerumMarketV2> = new Map();
  const tokensMints: Set<string> = new Set();
  for (let i = 0; i < marketsAccounts.length; i++) {
    const market = marketsAccounts[i];
    if (!market) continue;

    marketsByAddress.set(market.ownAddress.toString(), market);
    tokensMints.add(market.quoteMint.toString());
  }

  const tokenPriceResults = await runInBatch(
    [...Array.from(tokensMints)].map(
      (mint) => () => cache.getTokenPrice(mint, NetworkId.solana)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  let totalValue = 0;
  const liquidities: PortfolioLiquidity[] = [];
  for (let i = 0; i < openOrders.length; i += 1) {
    const openOrder = openOrders[i];
    const market = marketsByAddress.get(openOrder.market.toString());
    if (!market) continue;

    const { baseMint, quoteMint } = market;
    const tokenPriceQuote = tokenPrices.get(quoteMint.toString());
    if (!tokenPriceQuote) continue;

    const amountLeftInOrder = openOrder.quoteTokenTotal.dividedBy(
      10 ** tokenPriceQuote.decimals
    );
    const assets = [
      tokenPriceToAssetToken(
        quoteMint.toString(),
        amountLeftInOrder.toNumber(),
        NetworkId.solana,
        tokenPriceQuote
      ),
    ];
    const assetsValue = amountLeftInOrder
      .multipliedBy(tokenPriceQuote.price)
      .toNumber();
    const rewardAssets = [
      tokenPriceToAssetToken(baseMint.toString(), 0, NetworkId.solana),
    ];
    liquidities.push({
      assets,
      assetsValue,
      rewardAssets,
      rewardAssetsValue: 0,
      value: assetsValue,
      yields: [],
    });
    totalValue += assetsValue;
  }

  const element: PortfolioElement = {
    type: 'liquidity',
    networkId: NetworkId.solana,
    platformId,
    value: totalValue,
    label: 'Deposit',
    tags: ['Serum Open Orders'],
    data: { liquidities },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-serum`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
