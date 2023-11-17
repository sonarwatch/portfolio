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
import { MarginfiProgram, platformId, prefix } from './constants';
import { marginfiAccountStruct } from './structs/MarginfiAccount';
import { getInterestRates, wrappedI80F48toBigNumber } from './helpers';
import { accountsFilter } from './filters';
import { BankInfo } from './types';
import { ParsedAccount, getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import runInBatch from '../../utils/misc/runInBatch';
import { FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';

const fetcherExecutor: FetcherExecutor = async (
  owner: string,
  cache: Cache
) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    marginfiAccountStruct,
    MarginfiProgram,
    accountsFilter(owner)
  );
  if (accounts.length === 0) return [];

  const lendingAccountBalances = accounts.at(0)?.lendingAccount.balances;
  if (!lendingAccountBalances || lendingAccountBalances.length === 0) return [];

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  const suppliedLtvs: number[] = [];
  const borrowedWeights: number[] = [];

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
  if (banksInfo.length === 0) return [];

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
      suppliedLtvs.push(
        wrappedI80F48toBigNumber(bankInfo.config.assetWeightMaint)
          .decimalPlaces(2)
          .toNumber()
      );
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
      const bankLendingYields: Yield[] = [
        {
          apr: lendingApr,
          apy: aprToApy(lendingApr),
        },
      ];
      suppliedYields.push(bankLendingYields);
    }

    if (!accountBalanceInfo.liabilityShares.value.isZero()) {
      borrowedWeights.push(
        wrappedI80F48toBigNumber(bankInfo.config.liabilityWeightMaint)
          .decimalPlaces(2)
          .toNumber()
      );
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
      const bankBorrowedYields: Yield[] = [
        {
          apr: borrowingApr,
          apy: aprToApy(borrowingApr),
        },
      ];
      borrowedYields.push(bankBorrowedYields);
    }
  }

  if (suppliedAssets.length === 0 && borrowedAssets.length === 0) return [];

  const { borrowedValue, collateralRatio, healthRatio, suppliedValue, value } =
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
      collateralRatio,
      healthRatio,
      rewardAssets,
      value,
    },
  };
  return [element];
};
export default fetcherExecutor;
