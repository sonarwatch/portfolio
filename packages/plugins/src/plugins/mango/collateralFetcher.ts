import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  aprToApy,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { mangoV4Pid, platformId, banksKey } from './constants';
import { getClientSolana } from '../../utils/clients';
import { mangoAccountStruct } from './struct';
import { accountsFilter } from './filters';
import { getParsedProgramAccounts, u8ArrayToString } from '../../utils/solana';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';
import { BankEnhanced } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const userAccounts = await getParsedProgramAccounts(
    client,
    mangoAccountStruct,
    mangoV4Pid,
    accountsFilter(owner)
  );
  if (userAccounts.length === 0) return [];

  const banks = await cache.getItem<BankEnhanced[]>(banksKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!banks) return [];

  const tokensMints: Set<string> = new Set();
  const bankByIndex: Map<number, BankEnhanced> = new Map();
  banks.forEach((bank) => {
    bankByIndex.set(bank.tokenIndex, bank);
    tokensMints.add(bank.mint.toString());
  });

  const tokenPriceResults = await runInBatch(
    [...tokensMints].map(
      (mint) => () => cache.getTokenPrice(mint.toString(), NetworkId.solana)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  const elements: PortfolioElement[] = [];

  // store mango accounts for points
  await cache.setItem(
    owner,
    userAccounts.map((account) => account.pubkey.toString()),
    { prefix: platformId, networkId: NetworkId.solana }
  );

  for (let index = 0; index < userAccounts.length; index++) {
    const userAccount = userAccounts[index];
    const tokenPositions = userAccount.tokens;
    if (tokenPositions.length === 0) continue;
    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    for (let i = 0; i < tokenPositions.length; i++) {
      const tokenPosition = tokenPositions[i];
      // empty positions
      if (tokenPosition.tokenIndex === 65535) continue;
      if (tokenPosition.indexedPosition.isZero()) continue;

      const { tokenIndex } = tokenPosition;
      const bank = bankByIndex.get(tokenIndex);
      if (!bank) continue;

      const mint = bank.mint.toString();
      const tokenPrice = tokenPrices.get(mint);
      if (!tokenPrice) continue;

      // Deposit
      if (tokenPosition.indexedPosition.isPositive()) {
        const depositIndex = new BigNumber(bank.depositIndex);
        const assetToken = tokenPriceToAssetToken(
          mint,
          depositIndex
            .multipliedBy(tokenPosition.indexedPosition)
            .dividedBy(10 ** tokenPrice.decimals)
            .toNumber(),
          NetworkId.solana,
          tokenPrice
        );
        if (!assetToken) continue;

        suppliedAssets.push(assetToken);
        const apr = bank.depositApr;
        if (apr)
          suppliedYields.push([
            {
              apr,
              apy: aprToApy(apr),
            },
          ]);
        // Borrow
      } else {
        const borrowIndex = new BigNumber(bank.borrowIndex);
        const assetToken = tokenPriceToAssetToken(
          mint,
          borrowIndex
            .multipliedBy(tokenPosition.indexedPosition)
            .dividedBy(10 ** tokenPrice.decimals)
            .abs()
            .toNumber(),
          NetworkId.solana,
          tokenPrice
        );
        if (!assetToken) continue;

        borrowedAssets.push(assetToken);
        const apr = bank.borrowApr;
        if (apr)
          borrowedYields.push([
            {
              apr: -apr,
              apy: -aprToApy(apr),
            },
          ]);
      }
    }

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
      getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });
    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.solana,
      platformId,
      label: 'Lending',
      value,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields,
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
      name: u8ArrayToString(userAccount.name),
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-collateral`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
