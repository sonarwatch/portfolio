import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementMultiple,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { openOrdersV2Struct } from '../../raydium/structs/openOrders';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { clobVersions, openbookPlatform } from './constants';
import { serumOrdersFilter } from './filters';
import { CLOBMarket } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ordersAccounts = await getParsedProgramAccounts(
    client,
    openOrdersV2Struct,
    new PublicKey(clobVersions.openbookV1.programId),
    serumOrdersFilter(owner, openOrdersV2Struct)
  );
  if (ordersAccounts.length === 0) return [];

  const marketsAddresses: Set<string> = new Set();
  for (let i = 0; i < ordersAccounts.length; i++) {
    marketsAddresses.add(ordersAccounts[i].market.toString());
  }

  const markets = await cache.getItems<CLOBMarket>(
    Array.from(marketsAddresses),
    {
      prefix: clobVersions.openbookV1.prefix,
      networkId: NetworkId.solana,
    }
  );
  if (!markets) return [];

  const marketsByAddress: Map<string, CLOBMarket> = new Map();
  const tokensMints: Set<string> = new Set();
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    if (!market) continue;
    marketsByAddress.set(market.address, market);
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

  const rawAmountByMint: Map<string, BigNumber> = new Map();
  for (let i = 0; i < ordersAccounts.length; i += 1) {
    const openOrder = ordersAccounts[i];
    const market = marketsByAddress.get(openOrder.market.toString());
    if (!market) continue;

    const quoteMint = market.quoteMint.toString();
    const amountLeftToFill = openOrder.quoteTokenTotal;

    const totalAmount = rawAmountByMint.get(quoteMint);
    rawAmountByMint.set(quoteMint, amountLeftToFill.plus(totalAmount || 0));
  }

  let value = 0;
  const assets: PortfolioAsset[] = [];
  for (const [mint, rawAmount] of rawAmountByMint) {
    const tokenPrice = tokenPrices.get(mint);
    if (!tokenPrice) continue;

    const amount = rawAmount.dividedBy(10 ** tokenPrice.decimals).toNumber();
    if (amount === 0) continue;

    const asset = tokenPriceToAssetToken(
      mint,
      amount,
      NetworkId.solana,
      tokenPrice
    );
    assets.push(asset);
    value += asset.value ? asset.value : 0;
  }

  if (assets.length === 0) return [];

  const openBookElement: PortfolioElementMultiple = {
    type: 'multiple',
    networkId: NetworkId.solana,
    platformId: openbookPlatform.id,
    value,
    label: 'Deposit',
    tags: ['Limit Orders'],
    data: { assets },
  };

  return [openBookElement];
};

const fetcher: Fetcher = {
  id: `${platformId}-${openbookPlatform.id}`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
