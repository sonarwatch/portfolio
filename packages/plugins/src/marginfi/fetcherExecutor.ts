import {
  Context,
  FetcherExecutor,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  aprToApy,
} from '@sonarwatch/portfolio-core';
import { MarginfiProgram } from './constants';
import { getParsedProgramAccounts } from '../utils/solana';
import { marginfiAccountStruct } from './structs/MarginfiAccount';
import { getInterestRates, wrappedI80F48toBigNumber } from './helpers';
import { tokenPriceToAssetToken } from '../utils/misc/tokenPriceToAssetToken';
import { accountsFilter } from './filters';
import { BankInfo } from './types';
import { getClientSolana } from '../utils/clients';

const fetcherExecutor: FetcherExecutor = async (
  owner: string,
  context: Context
) => {
  const { tokenPriceCache } = context;
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    marginfiAccountStruct,
    MarginfiProgram,
    accountsFilter(owner)
  );
  if (accounts.length === 0) return [];
  const lendingAccountBalances = accounts.at(0)?.lendingAccount.balances;

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  if (lendingAccountBalances) {
    for (let index = 0; index < lendingAccountBalances.length; index += 1) {
      const accountBalanceInfo = lendingAccountBalances[index];
      const bankInfo = await context?.cache.get<BankInfo>(
        accountBalanceInfo.bankPk.toString(),
        {
          prefix: 'marginfi',
          networkId: NetworkId.solana,
        }
      );
      if (!bankInfo) continue;

      const { lendingApr, borrowingApr } = getInterestRates(bankInfo);
      const tokenPrice = await tokenPriceCache.get(
        bankInfo.mint.toString(),
        NetworkId.solana
      );

      if (!accountBalanceInfo.assetShares.value.isZero()) {
        const suppliedQuantity = wrappedI80F48toBigNumber(
          accountBalanceInfo.assetShares
        )
          .times(bankInfo.dividedAssetShareValue)
          .toNumber();

        suppliedAssets.push(
          tokenPriceToAssetToken(
            bankInfo.mint.toString(),
            suppliedQuantity,
            NetworkId.solana,
            tokenPrice
          )
        );
      }

      if (!accountBalanceInfo.liabilityShares.value.isZero()) {
        const borrowedQuantity = wrappedI80F48toBigNumber(
          accountBalanceInfo.liabilityShares
        )
          .times(bankInfo.dividedLiabilityShareValue)
          .toNumber();

        borrowedAssets.push(
          tokenPriceToAssetToken(
            bankInfo.mint.toString(),
            borrowedQuantity,
            NetworkId.solana,
            tokenPrice
          )
        );
      }
      const bankLendingYields: Yield[] = [
        {
          apr: lendingApr,
          apy: aprToApy(lendingApr),
        },
      ];
      const bankBorrowedYields: Yield[] = [
        {
          apr: borrowingApr,
          apy: aprToApy(borrowingApr),
        },
      ];
      suppliedYields.push(bankLendingYields);
      borrowedYields.push(bankBorrowedYields);
    }
  }

  const { borrowedValue, collateralRatio, suppliedValue, value } =
    getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

  if (
    borrowedAssets.length === 0 &&
    suppliedAssets.length === 0 &&
    rewardAssets.length === 0
  )
    return [];

  const element: PortfolioElement = {
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.solana,
    platformId: 'marginfi',
    label: 'Lending',
    value,
    data: {
      borrowedAssets,
      borrowedValue,
      borrowedYields,
      suppliedAssets,
      suppliedValue,
      suppliedYields,
      collateralRatio,
      rewardAssets,
      value,
    },
  };
  return [element];
};
export default fetcherExecutor;
