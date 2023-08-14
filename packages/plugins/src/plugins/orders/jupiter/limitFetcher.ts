import {
  NetworkId,
  PortfolioElement,
  PortfolioLiquidity,
  TokenPrice,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { platformId, jupiterLimitProgramId } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { limitOrderStruct } from './struct';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { jupiterLimitsFilter } from './filters';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

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
    tokensMints.add(limitOrdersAccounts[i].outputMint);
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
  for (let i = 0; i < limitOrdersAccounts.length; i += 1) {
    const limOrder = limitOrdersAccounts[i];
    const tokenPriceInput = tokenPrices.get(limOrder.inputMint.toString());
    const tokenPriceOutput = tokenPrices.get(limOrder.outputMint.toString());
    if (!tokenPriceInput || !tokenPriceOutput) continue;

    const amountLeftInOrder = limOrder.makingAmount.dividedBy(
      10 ** tokenPriceInput.decimals
    );
    const assets = [
      tokenPriceToAssetToken(
        limOrder.inputMint.toString(),
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
        limOrder.outputMint.toString(),
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
    tags: ['Jupiter Limit Orders'],
    data: { liquidities },
  };

  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-jupiter-limit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
