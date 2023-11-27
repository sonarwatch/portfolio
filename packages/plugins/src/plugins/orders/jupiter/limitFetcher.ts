import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementMultiple,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { limitOrderStruct } from './struct';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { jupiterLimitsFilter } from './filters';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { jupiterPlatform, limitProgramId } from './constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const limitOrdersAccounts = await getParsedProgramAccounts(
    client,
    limitOrderStruct,
    limitProgramId,
    jupiterLimitsFilter(owner)
  );
  if (limitOrdersAccounts.length === 0) return [];

  const tokensMints: Set<string> = new Set();
  for (let i = 0; i < limitOrdersAccounts.length; i += 1) {
    tokensMints.add(limitOrdersAccounts[i].inputMint.toString());
  }
  const tokenPriceResults = await cache.getTokenPrices(
    Array.from(tokensMints),
    NetworkId.solana
  );

  const tokenPriceById: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((tP) => {
    if (!tP) return;
    tokenPriceById.set(tP.address, tP);
  });

  const rawAmountByMint: Map<string, BigNumber> = new Map();
  for (let i = 0; i < limitOrdersAccounts.length; i += 1) {
    const limOrder = limitOrdersAccounts[i];
    const mint = limOrder.inputMint.toString();

    const amountLeftInOrder = limOrder.makingAmount;
    const totalAmount = rawAmountByMint.get(mint);
    rawAmountByMint.set(mint, amountLeftInOrder.plus(totalAmount || 0));
  }

  let value = 0;
  const assets: PortfolioAsset[] = [];
  for (const [mint, rawAmount] of rawAmountByMint) {
    if (rawAmount.isZero()) continue;

    const tokenPrice = tokenPriceById.get(mint);
    if (!tokenPrice) continue;

    const amount = rawAmount.dividedBy(10 ** tokenPrice.decimals).toNumber();
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

  const element: PortfolioElementMultiple = {
    type: 'multiple',
    networkId: NetworkId.solana,
    platformId: jupiterPlatform.id,
    value,
    label: 'Deposit',
    name: 'Limit Orders',
    data: { assets },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-jupiter-limit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
