import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { MarginfiProgram, platformId, banksKey } from './constants';
import { marginfiAccountStruct } from './structs/MarginfiAccount';
import { wrappedI80F48toBigNumber } from './helpers';
import { accountsFilter } from './filters';
import { BankInfo } from './types';
import { ParsedAccount, getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    marginfiAccountStruct,
    MarginfiProgram,
    accountsFilter(owner)
  );
  if (accounts.length === 0) return [];

  const banksInfo = await cache.getItem<ParsedAccount<BankInfo>[]>(banksKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!banksInfo || banksInfo.length === 0) return [];

  const banksInfoByAddress: Map<string, BankInfo> = new Map();
  const tokensAddresses: Set<string> = new Set();
  banksInfo.forEach((bankInfo) => {
    if (!bankInfo) return;
    banksInfoByAddress.set(bankInfo.pubkey.toString(), bankInfo as BankInfo);
    tokensAddresses.add(bankInfo.mint.toString());
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(tokensAddresses),
    NetworkId.solana
  );

  const elements: PortfolioElement[] = [];
  for (const account of accounts) {
    const { balances } = account.lendingAccount;
    if (!balances || balances.length === 0) continue;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];
    const suppliedLtvs: number[] = [];
    const borrowedWeights: number[] = [];

    for (let index = 0; index < balances.length; index += 1) {
      const balance = balances[index];
      if (balance.bankPk.toString() === '11111111111111111111111111111111')
        continue;
      const bankInfo = banksInfoByAddress.get(balance.bankPk.toString());
      if (!bankInfo) continue;

      const tokenPrice = tokenPriceById.get(bankInfo.mint.toString());
      if (!balance.assetShares.value.isZero()) {
        suppliedLtvs.push(bankInfo.suppliedLtv);
        const suppliedAmount = wrappedI80F48toBigNumber(balance.assetShares)
          .times(bankInfo.dividedAssetShareValue)
          .toNumber();

        suppliedAssets.push(
          tokenPriceToAssetToken(
            bankInfo.mint.toString(),
            suppliedAmount,
            NetworkId.solana,
            tokenPrice
          )
        );
        suppliedYields.push(bankInfo.suppliedYields);
      }

      if (!balance.liabilityShares.value.isZero()) {
        borrowedWeights.push(bankInfo.borrowedWeight);
        const borrowedAmount = wrappedI80F48toBigNumber(balance.liabilityShares)
          .times(bankInfo.dividedLiabilityShareValue)
          .toNumber();

        borrowedAssets.push(
          tokenPriceToAssetToken(
            bankInfo.mint.toString(),
            borrowedAmount,
            NetworkId.solana,
            tokenPrice
          )
        );
        borrowedYields.push(bankInfo.borrowedYields);
      }
    }

    if (suppliedAssets.length === 0 && borrowedAssets.length === 0) continue;

    const { borrowedValue, healthRatio, suppliedValue, value, rewardValue } =
      getElementLendingValues(
        suppliedAssets,
        borrowedAssets,
        rewardAssets,
        suppliedLtvs,
        borrowedWeights
      );

    const element: PortfolioElement = {
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
        collateralRatio: null,
        healthRatio,
        rewardAssets,
        rewardValue,
        value,
      },
    };
    elements.push(element);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
