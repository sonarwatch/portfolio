import {
  apyToApr,
  NetworkId,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, poolsKey } from './constants';
import { getDerivedAccount, getDerivedPendingWithdraws } from './helpers';
import driftDepositsFetcher from '../drift/depositsFetcher';
import kaminoLendDepositFetcher from '../kamino/lendsFetcher';
import mangoDepositFetcher from '../mango/collateralFetcher';
import { walletTokensPlatform } from '../tokens/constants';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getClientSolana } from '../../utils/clients';
import { pendingWithdrawalStruct, userAccountStruct } from './struct';
import { obligationStruct } from '../save/structs';
import { mainMarket, marketsPrefix, reservesPrefix } from '../save/constants';
import { MarketInfo, ReserveInfo, ReserveInfoExtended } from '../save/types';
import { getElementsFromObligations } from '../save/helpers';
import { marginfiAccountStruct } from '../marginfi/structs/MarginfiAccount';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { BankInfo } from '../marginfi/types';
import { banksKey, platform } from '../marginfi/constants';
import { getElementFromAccount } from '../marginfi/helpers';
import { AllocationInfo } from './poolsJob';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const pda = getDerivedAccount(owner);

  const [userAccount, allocationsInfo] = await Promise.all([
    getParsedAccountInfo(client, userAccountStruct, new PublicKey(pda)),
    cache.getItem<AllocationInfo[]>(poolsKey, {
      prefix: platformId,
    }),
  ]);
  if (!userAccount) return [];

  const isSolendActivated =
    userAccount.solend_obligation.toString() !==
    '11111111111111111111111111111111';

  const isMarginFiActivated =
    userAccount.mfi_account.toString() !== '11111111111111111111111111111111';

  const portfolioElements: PortfolioElement[] = [];
  const [
    marginfiAccount,
    driftElements,
    kaminoElements,
    mangoElements,
    saveObligation,
  ] = await Promise.all([
    isMarginFiActivated
      ? getParsedAccountInfo(
          client,
          marginfiAccountStruct,
          userAccount.mfi_account
        )
      : undefined,
    driftDepositsFetcher.executor(pda, cache),
    kaminoLendDepositFetcher.executor(pda, cache),
    mangoDepositFetcher.executor(pda, cache),
    isSolendActivated
      ? getParsedAccountInfo(
          client,
          obligationStruct,
          userAccount.solend_obligation
        )
      : undefined,
  ]);

  portfolioElements.push(
    ...[...driftElements, ...kaminoElements, ...mangoElements]
  );

  if (saveObligation) {
    const mainMarketInfo = await cache.getItem<MarketInfo>(mainMarket, {
      prefix: marketsPrefix,
      networkId: NetworkId.solana,
    });
    if (mainMarketInfo) {
      const reserveAddresses: Set<string> = new Set();

      mainMarketInfo.reserves.forEach((reserve) => {
        reserveAddresses.add(reserve.address);
      });
      const reservesInfos = await cache.getItems<ReserveInfoExtended>(
        Array.from(reserveAddresses),
        {
          prefix: reservesPrefix,
          networkId: NetworkId.solana,
        }
      );
      if (reservesInfos.length !== 0) {
        const reserveByAddress: Map<string, ReserveInfo> = new Map();
        reservesInfos.forEach((reserve) => {
          if (!reserve) return;

          reserveByAddress.set(reserve.pubkey, reserve);
        });

        const solendElements: PortfolioElement[] =
          await getElementsFromObligations(
            [saveObligation],
            reserveByAddress,
            new Map([[mainMarket, mainMarketInfo]]),
            owner,
            cache
          );
        portfolioElements.push(...solendElements);
      }
    }
  }

  if (marginfiAccount) {
    const banksInfo = await cache.getItem<ParsedAccount<BankInfo>[]>(banksKey, {
      prefix: platform.id,
      networkId: NetworkId.solana,
    });
    if (banksInfo) {
      const banksInfoByAddress: Map<string, BankInfo> = new Map();
      const tokensAddresses: Set<string> = new Set();
      banksInfo.forEach((bankInfo) => {
        if (!bankInfo) return;
        banksInfoByAddress.set(
          bankInfo.pubkey.toString(),
          bankInfo as BankInfo
        );
        tokensAddresses.add(bankInfo.mint.toString());
      });

      const tokenPriceById = await cache.getTokenPricesAsMap(
        Array.from(tokensAddresses),
        NetworkId.solana
      );

      const element = getElementFromAccount(
        marginfiAccount,
        banksInfoByAddress,
        tokenPriceById
      );
      if (element) portfolioElements.push(element);
    }
  }

  const elements: PortfolioElement[] = [];
  for (const element of portfolioElements) {
    const tmpElement = element;
    tmpElement.name =
      tmpElement.platformId === walletTokensPlatform.id
        ? 'Tokens/Rewards'
        : tmpElement.platformId.slice(0, 1).toUpperCase() +
          tmpElement.platformId.slice(1);
    tmpElement.platformId = platformId;
    elements.push({
      ...tmpElement,
    });
  }

  if (allocationsInfo) {
    const registry = new ElementRegistry(NetworkId.solana, platformId);
    const lendingElement = registry.addElementBorrowlend({
      label: 'Lending',
      ref: pda,
    });
    const withdrawElement = registry.addElementMultiple({
      label: 'Deposit',
      name: 'Boosted Withdraws',
    });
    if (userAccount.activeWithdraws.some((w) => w !== 0)) {
      const pdas = getDerivedPendingWithdraws(
        owner,
        userAccount.activeWithdraws
      );

      const withdraws = await getParsedMultipleAccountsInfo(
        client,
        pendingWithdrawalStruct,
        pdas
      );

      for (const withdraw of withdraws) {
        if (!withdraw) continue;
        const allocation = allocationsInfo[withdraw.allocationIndex];
        if (!allocation) continue;

        withdrawElement.addAsset({
          address: allocation.mint,
          amount: withdraw.nativeAmount.toNumber(),
          ref: withdraw.pubkey.toString(),
          attributes: {
            lockedUntil: withdraw.createdTimestamp
              .plus(withdraw.cooldownSeconds)
              .times(1000)
              .toNumber(),
          },
        });
      }
    }

    for (let i = 0; i < userAccount.regularAllocations.length; i++) {
      const allocationInfo = allocationsInfo?.at(i);
      if (!allocationInfo) continue;

      const userBoostedAllocation = userAccount.regularAllocations[i];
      lendingElement.addSuppliedAsset({
        address: allocationInfo.mint,
        amount: userBoostedAllocation.times(allocationInfo.lPrice).toNumber(),
        attributes: {
          tags: ['Boosted'],
        },
      });
      lendingElement.addSuppliedYield([
        {
          apy: allocationInfo.lApy,
          apr: apyToApr(allocationInfo.lApy),
        },
      ]);

      const userProtectedAllocation = userAccount.protectedAllocations[i];

      lendingElement.addSuppliedAsset({
        address: allocationInfo.mint,
        amount: userProtectedAllocation.times(allocationInfo.pPrice).toNumber(),
        attributes: {
          tags: ['Protected'],
        },
      });
      lendingElement.addSuppliedYield([
        {
          apy: allocationInfo.pApy,
          apr: apyToApr(allocationInfo.pApy),
        },
      ]);
    }
    const newElements = await registry.getElements(cache);
    elements.push(...newElements);
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
