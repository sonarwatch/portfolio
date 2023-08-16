import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  TokenPrice,
  networks,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { serumOrdersFilter } from './filters';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { CLOBMarket, CLOBVersion } from './types';
import { serumPlatform } from '../../../platforms';

export default function getSerumFetcherExecutor(
  serumInfo: CLOBVersion
): FetcherExecutor {
  return async (owner: string, cache: Cache) => {
    const client = getClientSolana();

    const ordersAccounts = await getParsedProgramAccounts(
      client,
      serumInfo.orderStruct,
      new PublicKey(serumInfo.programId),
      serumOrdersFilter(owner, serumInfo.orderStruct)
    );

    const marketsAddresses: Set<string> = new Set();
    for (let i = 0; i < ordersAccounts.length; i++) {
      marketsAddresses.add(ordersAccounts[i].market.toString());
    }

    const markets = await cache.getItems<CLOBMarket>(
      Array.from(marketsAddresses),
      {
        prefix: serumInfo.prefix,
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
      tokensMints.add(market.baseMint.toString());
    }
    tokensMints.add(networks.solana.native.address);
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
    const emptyAccounts: number[] = [];
    const unsettledBalances: Map<string, BigNumber> = new Map();
    for (let i = 0; i < ordersAccounts.length; i += 1) {
      const openOrder = ordersAccounts[i];
      const market = marketsByAddress.get(openOrder.market.toString());
      if (!market) continue;

      const quoteMint = market.quoteMint.toString();
      const baseMint = market.baseMint.toString();
      const amountLeftToFill = openOrder.quoteTokenTotal;
      const amountLeftToRecover = openOrder.baseTokenFree;
      if (!amountLeftToRecover.isZero()) {
        const unsettledAmount = rawAmountByMint.get(quoteMint);
        unsettledBalances.set(
          baseMint,
          amountLeftToRecover.plus(unsettledAmount || 0)
        );
      }
      if (amountLeftToFill.isZero() && amountLeftToRecover.isZero()) {
        emptyAccounts.push(openOrder.lamports / 10 ** 9);
      } else {
        const totalAmount = rawAmountByMint.get(quoteMint);
        rawAmountByMint.set(quoteMint, amountLeftToFill.plus(totalAmount || 0));
      }
    }

    let value = 0;
    const openOrdersAssets: PortfolioAsset[] = [];
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
      openOrdersAssets.push(asset);
      value += asset.value ? asset.value : 0;
    }

    let emptyAccountsValue = 0;
    const emptyAccountsAssets: PortfolioAsset[] = [];
    const solTokenPrice = tokenPrices.get(networks.solana.native.address);
    for (const amount of emptyAccounts) {
      const asset = tokenPriceToAssetToken(
        networks.solana.native.address,
        amount,
        NetworkId.solana,
        solTokenPrice
      );
      emptyAccountsAssets.push(asset);
      emptyAccountsValue += asset.value ? asset.value : 0;
    }

    let unsettledValue = 0;
    const unsettledBalancesAssets: PortfolioAsset[] = [];
    for (const [mint, rawAmount] of unsettledBalances) {
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
      unsettledBalancesAssets.push(asset);
      unsettledValue += asset.value ? asset.value : 0;
    }
    const elements: PortfolioElement[] = [];

    if (openOrdersAssets.length !== 0) {
      elements.push({
        type: 'multiple',
        networkId: NetworkId.solana,
        platformId: serumPlatform.id,
        value,
        label: 'Deposit',
        tags: ['In Open Orders', serumInfo.name],
        data: { assets: openOrdersAssets },
      });
    }
    if (emptyAccountsAssets.length !== 0) {
      elements.push({
        type: 'multiple',
        networkId: NetworkId.solana,
        platformId: serumPlatform.id,
        value: emptyAccountsValue,
        label: 'Rewards',
        tags: ['Empty Orders Accounts', serumInfo.name],
        data: { assets: emptyAccountsAssets },
      });
    }
    if (unsettledBalancesAssets.length !== 0) {
      elements.push({
        type: 'multiple',
        networkId: NetworkId.solana,
        platformId: serumPlatform.id,
        value: unsettledValue,
        label: 'Rewards',
        tags: ['Unsettled Balances', serumInfo.name],
        data: { assets: unsettledBalancesAssets },
      });
    }

    return elements;
  };
}
