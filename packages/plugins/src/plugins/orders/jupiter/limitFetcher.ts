import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementMultiple,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId, jupiterLimitProgramId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { limitOrderStruct } from './struct';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { jupiterLimitsFilter } from './filters';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { jupiterPlatform } from '../../../platforms';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const limitOrdersAccounts = await getParsedProgramAccounts(
    client,
    limitOrderStruct,
    jupiterLimitProgramId,
    jupiterLimitsFilter(owner)
  );

  const tokensMints: Set<PublicKey> = new Set();
  for (let i = 0; i < limitOrdersAccounts.length; i += 1) {
    tokensMints.add(limitOrdersAccounts[i].inputMint);
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

  const element: PortfolioElementMultiple = {
    type: 'multiple',
    networkId: NetworkId.solana,
    platformId: jupiterPlatform.id,
    value,
    label: 'Deposit',
    tags: ['Limit Orders'],
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
