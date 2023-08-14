import {
  NetworkId,
  PortfolioElement,
  PortfolioLiquidity,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId, serumProgramId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../../utils/solana';
import { openOrdersV2Struct } from '../../raydium/structs/openOrders';
import { serumOrderFilter } from './filters';
import { SerumMarketV2, serumMarketV2Struct } from './structs';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ordersAccount = await getParsedProgramAccounts(
    client,
    openOrdersV2Struct,
    serumProgramId,
    serumOrderFilter(owner)
  );
  const marketsAddresses: Set<PublicKey> = new Set();
  for (let i = 0; i < ordersAccount.length; i++) {
    const order = ordersAccount[i];
    marketsAddresses.add(order.market);
  }

  const marketsAccounts = await getParsedMultipleAccountsInfo(
    client,
    serumMarketV2Struct,
    Array.from(marketsAddresses)
  );
  if (!marketsAccounts) return [];

  const marketsByAddress: Map<PublicKey, SerumMarketV2> = new Map();
  const tokensMints: Set<PublicKey> = new Set();
  for (let i = 0; i < marketsAccounts.length; i++) {
    const market = marketsAccounts[i];
    if (!market) continue;
    marketsByAddress.set(market.ownAddress, market);
    tokensMints.add(market.baseMint);
    tokensMints.add(market.quoteMint);
  }

  const tokenPriceResults = await runInBatch(
    [...Array.from(tokensMints)].map(
      (mint) => () => cache.getTokenPrice(mint.toString(), NetworkId.solana)
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
  for (let i = 0; i < ordersAccount.length; i += 1) {
    const openOrder = ordersAccount[i];
    const market = marketsByAddress.get(openOrder.market);
    if (!market) continue;

    const { baseMint, quoteMint } = market;
    const tokenPriceInput = tokenPrices.get(baseMint.toString());
    const tokenPriceOutput = tokenPrices.get(quoteMint.toString());
    if (!tokenPriceInput || !tokenPriceOutput) continue;

    const amountLeftInOrder = openOrder.baseTokenFree.dividedBy(
      10 ** tokenPriceInput.decimals
    );
    const assets = [
      tokenPriceToAssetToken(
        baseMint.toString(),
        amountLeftInOrder.toNumber(),
        NetworkId.solana,
        tokenPriceInput
      ),
    ];
    const assetsValue = amountLeftInOrder
      .multipliedBy(tokenPriceInput.price)
      .toNumber();
    const rewardAssets = [
      tokenPriceToAssetToken(
        quoteMint.toString(),
        0,
        NetworkId.solana,
        tokenPriceOutput
      ),
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
