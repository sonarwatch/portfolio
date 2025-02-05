import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementMultiple,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import { platformId, limitV1ProgramId, limitV2ProgramId } from './constants';
import { limitOrderStruct, limitOrderV2Struct } from './structs';
import { limitFilters } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const allAccounts = (
    await Promise.all([
      getParsedProgramAccounts(
        client,
        limitOrderStruct,
        limitV1ProgramId,
        limitFilters(owner)
      ),
      getParsedProgramAccounts(
        client,
        limitOrderV2Struct,
        limitV2ProgramId,
        limitFilters(owner)
      ),
    ])
  ).flat();
  if (allAccounts.length === 0) return [];

  const mints: Set<string> = new Set();
  allAccounts.forEach((account) => mints.add(account.inputMint.toString()));

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const rawAmountByMint: Map<string, BigNumber> = new Map();
  for (let i = 0; i < allAccounts.length; i += 1) {
    const limOrder = allAccounts[i];
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
    platformId,
    value,
    label: 'Deposit',
    name: `Limit Orders (${allAccounts.length})`,
    data: { assets },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-limit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
