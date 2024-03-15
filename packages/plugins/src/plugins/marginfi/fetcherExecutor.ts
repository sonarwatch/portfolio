import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  aprToApy,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { MarginfiProgram, platformId, prefix } from './constants';
import { marginfiAccountStruct } from './structs/MarginfiAccount';
import { getInterestRates, wrappedI80F48toBigNumber } from './helpers';
import { accountsFilter } from './filters';
import { BankInfo } from './types';
import { ParsedAccount, getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import { getPythPrice } from '../../utils/solana/pyth/helpers';
import { OracleSetup } from './structs/Bank';

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

  const banksInfo = await cache.getAllItems<ParsedAccount<BankInfo>>({
    prefix,
    networkId: NetworkId.solana,
  });
  if (banksInfo.length === 0) return [];

  const banksInfoByAddress: Map<string, BankInfo> = new Map();
  const tokensAddresses: Set<string> = new Set();
  banksInfo.forEach((bankInfo) => {
    if (!bankInfo) return;
    banksInfoByAddress.set(bankInfo.pubkey.toString(), bankInfo as BankInfo);
    tokensAddresses.add(bankInfo.mint.toString());
  });

  const tokenPriceById = await getTokenPricesMap(
    Array.from(tokensAddresses),
    NetworkId.solana,
    cache
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

      const { lendingApr, borrowingApr } = getInterestRates(bankInfo);
      const tokenPrice = tokenPriceById.get(bankInfo.mint.toString());
      let price: number | undefined;
      if (!tokenPrice && bankInfo.config.oracleSetup === OracleSetup.PythEma) {
        const pythOracle = new PublicKey(bankInfo.config.oracleKeys[0]);
        const pythAccount = await client.getAccountInfo(pythOracle);
        const pythPrice = getPythPrice(pythAccount);
        if (pythPrice) price = pythPrice.price;
      }

      if (!balance.assetShares.value.isZero()) {
        suppliedLtvs.push(
          wrappedI80F48toBigNumber(bankInfo.config.assetWeightMaint)
            .decimalPlaces(2)
            .toNumber()
        );
        const suppliedQuantity = wrappedI80F48toBigNumber(balance.assetShares)
          .times(bankInfo.dividedAssetShareValue)
          .toNumber();

        suppliedAssets.push(
          tokenPriceToAssetToken(
            bankInfo.mint.toString(),
            suppliedQuantity,
            NetworkId.solana,
            tokenPrice,
            price
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

      if (!balance.liabilityShares.value.isZero()) {
        borrowedWeights.push(
          wrappedI80F48toBigNumber(bankInfo.config.liabilityWeightMaint)
            .decimalPlaces(2)
            .toNumber()
        );
        const borrowedQuantity = wrappedI80F48toBigNumber(
          balance.liabilityShares
        )
          .times(bankInfo.dividedLiabilityShareValue)
          .toNumber();

        borrowedAssets.push(
          tokenPriceToAssetToken(
            bankInfo.mint.toString(),
            borrowedQuantity,
            NetworkId.solana,
            tokenPrice,
            price
          )
        );
        const bankBorrowedYields: Yield[] = [
          {
            apr: -borrowingApr,
            apy: -aprToApy(borrowingApr),
          },
        ];
        borrowedYields.push(bankBorrowedYields);
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
export default fetcherExecutor;
