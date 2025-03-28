import { LeverageSide, NetworkId, aprToApy } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  driftProgram,
  keySpotMarkets,
  perpMarketsIndexesKey,
  platformId,
} from './constants';
import {
  SpotBalanceType,
  UserAccount,
  insuranceFundStakeStruct,
  userAccountStruct,
} from './struct';
import {
  getSignedTokenAmount,
  getTokenAmount,
  getUserAccountsPublicKeys,
  getUserInsuranceFundStakeAccountPublicKey,
  isSpotPositionAvailable,
} from './helpers';
import { PerpMarketIndexes, SpotMarketEnhanced } from './types';
import {
  ParsedAccount,
  TokenAccount,
  getParsedMultipleAccountsInfo,
  tokenAccountStruct,
  u8ArrayToString,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import {
  calculatePositionPNL,
  positionCurrentDirection,
} from './perpHelpers/position';
import { PRICE_PRECISION_BIG_NUMBER } from './perpHelpers/constants';
import { PositionDirection } from './perpHelpers/types';
import { getOraclePrice } from './perpHelpers/getOraclePrice';
import { getPerpMarket } from './perpHelpers/getPerpMarket';
import { getMintFromOracle } from './perpHelpers/getMintFromOracle';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';

export const spotMarketsMemo = new MemoizedCache<SpotMarketEnhanced[]>(
  keySpotMarkets,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const spotMarketsItems = await spotMarketsMemo.getItem(cache);
  if (!spotMarketsItems) throw new Error('Spot markets not cached');

  const spotMarketByIndex: Map<number, SpotMarketEnhanced> = new Map();
  const insuranceFundStakeAccountsAddresses: PublicKey[] = [];
  const insuranceVaultsPkeys: PublicKey[] = [];
  for (const spotMarketItem of spotMarketsItems || []) {
    insuranceFundStakeAccountsAddresses[spotMarketItem.marketIndex] =
      getUserInsuranceFundStakeAccountPublicKey(
        driftProgram,
        new PublicKey(owner),
        spotMarketItem.marketIndex
      );
    insuranceVaultsPkeys.push(
      new PublicKey(spotMarketItem.insuranceFund.vault)
    );
    spotMarketByIndex.set(spotMarketItem.marketIndex, spotMarketItem);
  }

  const [insuranceAccounts, insuranceTokenAccounts] = await Promise.all([
    getParsedMultipleAccountsInfo(
      client,
      insuranceFundStakeStruct,
      insuranceFundStakeAccountsAddresses
    ),
    getParsedMultipleAccountsInfo(
      client,
      tokenAccountStruct,
      insuranceVaultsPkeys
    ),
  ]);

  const insuranceTokenAccountsById: Map<string, TokenAccount> = new Map();
  insuranceTokenAccounts.forEach((acc) => {
    if (acc) insuranceTokenAccountsById.set(acc.pubkey.toString(), acc);
  });

  // Insurance
  const elementInsurance = elementRegistry.addElementMultiple({
    label: 'Staked',
    name: 'Insurance Fund',
    link: 'https://app.drift.trade/vaults/insurance-fund-vaults',
  });

  insuranceAccounts.forEach((account, i) => {
    if (!account || account.ifShares.isZero()) return;

    const spotMarket = spotMarketByIndex.get(i);
    if (!spotMarket) return;

    const { insuranceFund, mint } = spotMarket;

    const vault = insuranceTokenAccountsById.get(
      insuranceFund.vault.toString()
    );
    if (!vault) return;

    elementInsurance.addAsset({
      address: mint,
      amount: account.ifShares
        .dividedBy(insuranceFund.totalShares)
        .times(vault.amount),
      ref: account.pubkey,
      sourceRefs: [
        { name: 'Vault', address: insuranceFund.vault.toString() },
        { name: 'Market', address: spotMarket.pubkey.toString() },
      ],
    });
  });

  // Perps part
  let id = 0;
  const userAccounts: (ParsedAccount<UserAccount> | null)[] = [];
  let parsedAccount;
  do {
    const accountPubKeys = getUserAccountsPublicKeys(
      driftProgram,
      new PublicKey(owner),
      id,
      id + 10
    );
    parsedAccount = await getParsedMultipleAccountsInfo(
      client,
      userAccountStruct,
      accountPubKeys
    );
    userAccounts.push(...parsedAccount);
    id += 10;
  } while (parsedAccount[parsedAccount.length]);

  if (!userAccounts || userAccounts.length === 0)
    return elementRegistry.getElements(cache);

  const perpMarketIndexesArr = await cache.getItem<PerpMarketIndexes>(
    perpMarketsIndexesKey,
    {
      prefix: platformId,
      networkId: NetworkId.solana,
    }
  );
  const perpMarketAddressByIndex: Map<number, string> = new Map();
  perpMarketIndexesArr?.forEach(([index, address]) => {
    perpMarketAddressByIndex.set(index, address);
  });

  // One user can have multiple sub-account
  for (const userAccount of userAccounts) {
    if (!userAccount) continue;

    const marketIndexRef = 0;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: u8ArrayToString(userAccount.name),
      ref: userAccount.pubkey,
      link: 'https://app.drift.trade/',
    });

    for (const perpPosition of userAccount.perpPositions) {
      if (perpPosition.baseAssetAmount.isZero()) continue;
      const perpMarketAddress = perpMarketAddressByIndex.get(
        perpPosition.marketIndex
      );
      if (!perpMarketAddress) continue;

      const market = await getPerpMarket(perpMarketAddress, client);
      if (!market) continue;

      const oraclePriceData = await getOraclePrice(
        market.amm.oracle.toString(),
        market.amm.oracleSource,
        client
      );
      if (!oraclePriceData || oraclePriceData.price.isZero()) continue;

      const pnl = new BigNumber(
        calculatePositionPNL(market, perpPosition, oraclePriceData).toString()
      )
        .div(PRICE_PRECISION_BIG_NUMBER)
        .toNumber();

      const side =
        positionCurrentDirection(perpPosition) === PositionDirection.LONG
          ? LeverageSide.long
          : LeverageSide.short;

      const mint = await getMintFromOracle(market.amm.oracle.toString(), cache);

      element.addUnsettledGenericAsset({
        value: pnl,
        name: u8ArrayToString(market.name),
        address: mint || undefined,
        attributes: {
          tags: [side],
        },
        sourceRefs: [{ name: 'Lending Market', address: perpMarketAddress }],
      });
    }

    // Each account has up to 8 SpotPositions
    for (const spotPosition of userAccount.spotPositions) {
      if (spotPosition.scaledBalance.isZero()) continue;
      const countForBase = spotPosition.marketIndex === marketIndexRef;

      const countForQuote = marketIndexRef === 0;
      if (
        isSpotPositionAvailable(spotPosition) ||
        (!countForBase && !countForQuote)
      ) {
        continue;
      }

      const spotMarket = spotMarketByIndex.get(spotPosition.marketIndex);
      if (!spotMarket) continue;

      let tokenAmount = new BigNumber(0);
      if (
        spotMarket.marketIndex !== 0 &&
        spotPosition.balanceType === SpotBalanceType.Deposit
      ) {
        tokenAmount = getTokenAmount(
          spotPosition.scaledBalance,
          spotMarket,
          spotPosition.balanceType
        );
      } else {
        tokenAmount = getSignedTokenAmount(
          getTokenAmount(
            spotPosition.scaledBalance,
            spotMarket,
            spotPosition.balanceType
          ),
          spotPosition.balanceType
        );
      }

      if (spotPosition.balanceType === SpotBalanceType.Deposit) {
        element.addSuppliedAsset({
          address: spotMarket.mint,
          amount: tokenAmount,
          sourceRefs: [
            { name: 'Lending Market', address: spotMarket.pubkey.toString() },
          ],
        });
        element.addSuppliedYield([
          {
            apr: spotMarket.depositApr,
            apy: aprToApy(spotMarket.depositApr),
          },
        ]);
      } else if (spotPosition.balanceType === SpotBalanceType.Borrow) {
        element.addBorrowedAsset({
          address: spotMarket.mint,
          amount: tokenAmount.abs(),
          sourceRefs: [
            { name: 'Lending Market', address: spotMarket.pubkey.toString() },
          ],
        });
        element.addSuppliedYield([
          {
            apr: -spotMarket.borrowApr,
            apy: -aprToApy(spotMarket.borrowApr),
          },
        ]);
      }
    }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
