import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  groupPrefix,
  platformId,
  redeemProgramId,
  rootBankPrefix,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts, usdcSolanaMint } from '../../utils/solana';
import { redeemFilter } from './filters';
import { RootBank, TokenInfo, mangoAccountV3Struct } from './struct';
import runInBatch from '../../utils/misc/runInBatch';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { mSOLMint } from '../marinade/constants';

const mints = [
  'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
  '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
  '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
  'So11111111111111111111111111111111111111112',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  '11111111111111111111111111111111',
  'AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3',
  '11111111111111111111111111111111',
  mSOLMint,
  '9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa',
  'KgV1GvrHQmRBY8sHQQeUKwTm2r2h8t4C8qt12Cw1HVE',
  '11111111111111111111111111111111',
  '7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx',
  usdcSolanaMint,
];

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const redeemAccounts = await getParsedProgramAccounts(
    client,
    mangoAccountV3Struct,
    redeemProgramId,
    redeemFilter(owner)
  );

  if (redeemAccounts.length === 0) return [];

  const tokenPriceResults = await runInBatch(
    mints.map((mint) => () => cache.getTokenPrice(mint, NetworkId.solana))
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  const borrowedAssets: PortfolioAsset[] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const rewardAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const borrowedYields: Yield[][] = [];

  for (let i = 0; i < redeemAccounts.length; i++) {
    const account = redeemAccounts[i];
    const tokensInfo = await cache.getItem<TokenInfo[]>(
      account.mangoGroup.toString(),
      {
        prefix: groupPrefix,
        networkId: NetworkId.solana,
      }
    );
    if (!tokensInfo) continue;

    for (let n = 0; n < account.deposits.length; n++) {
      const tokenMint = mints[n];
      if (tokenMint === '11111111111111111111111111111111') continue;
      const tokenDeposit = account.deposits[n];

      if (tokenDeposit.isZero()) continue;

      const tokenPrice = tokenPrices.get(tokenMint);
      if (!tokenPrice) continue;

      const tokenBank = tokensInfo[n].rootBank.toString();

      const rootBank = await cache.getItem<RootBank>(tokenBank, {
        prefix: rootBankPrefix,
        networkId: NetworkId.solana,
      });
      if (!rootBank) continue;

      const depositAmount = tokenDeposit
        .multipliedBy(rootBank.depositIndex)
        .dividedBy(10 ** tokenPrice.decimals)
        .toNumber();

      if (depositAmount !== 0) {
        suppliedAssets.push(
          tokenPriceToAssetToken(
            tokenMint,
            depositAmount,
            NetworkId.solana,
            tokenPrice
          )
        );
      }
    }
  }

  if (suppliedAssets.length === 0) return [];

  const elements: PortfolioElement[] = [];
  const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
    getElementLendingValues({ suppliedAssets, borrowedAssets, rewardAssets });

  elements.push({
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.solana,
    platformId,
    label: 'Deposit',
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
    name: 'Redeem V3',
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-redeem`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
