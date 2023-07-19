import {
  Cache,
  FetcherExecutor,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  TokenPrice,
  Yield,
  aprToApy,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { MarginfiProgram, platformId, prefix } from './constants';
import { marginfiAccountStruct } from './structs/MarginfiAccount';
import { getInterestRates, wrappedI80F48toBigNumber } from './helpers';
import { accountsFilter } from './filters';
import { BankInfo } from './types';
import { ParsedAccount, getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';

const fetcherExecutor: FetcherExecutor = async (
  owner: string,
  cache: Cache
) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    marginfiAccountStruct,
    MarginfiProgram,
    accountsFilter(owner)
  );
  if (accounts.length === 0) return [];

  const lendingAccountBalances = accounts.at(0)?.lendingAccount.balances;
  if (!lendingAccountBalances) return [];

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const balancesAddresses = lendingAccountBalances.map(
    (lendingAccountBalance) => lendingAccountBalance.bankPk.toString()
  );
  const banksInfo = await cache.getItems<ParsedAccount<BankInfo>>(
    balancesAddresses,
    {
      prefix,
      networkId: NetworkId.solana,
    }
  );
  const banksInfoByAddress: Map<string, BankInfo> = new Map();
  const tokensAddresses: Set<string> = new Set();
  banksInfo.forEach((bankInfo) => {
    if (!bankInfo) return;
    banksInfoByAddress.set(bankInfo.pubkey.toString(), bankInfo as BankInfo);
    tokensAddresses.add(bankInfo.mint.toString());
  });

  const tokenPriceResults = await runInBatch(
    [...tokensAddresses].map(
      (mint) => () => cache.getTokenPrice(mint, NetworkId.solana)
    )
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPriceResults.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  for (let index = 0; index < lendingAccountBalances.length; index += 1) {
    const accountBalanceInfo = lendingAccountBalances[index];
    const bankInfo = banksInfoByAddress.get(
      accountBalanceInfo.bankPk.toString()
    );
    if (!bankInfo) continue;

    const { lendingApr, borrowingApr } = getInterestRates(bankInfo);
    const tokenPrice = tokenPrices.get(bankInfo.mint.toString());
    if (!tokenPrice) continue;

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
      collateralRatio,
      rewardAssets,
      value,
    },
  };
  return [element];
};
export default fetcherExecutor;
